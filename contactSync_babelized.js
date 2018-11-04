'use strict';

const serverlessCheckpointer = require('./serverlessCheckpointer');

var syncContact = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(myContact, dest, total) {
    const serverlessCheckpointerState = serverlessCheckpointer.getState(arguments);

    var foundContacts, newContact;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      if (serverlessCheckpointer.continuing(serverlessCheckpointerState)) {
        ({
          _context,
          myContact,
          dest,
          total,
          foundContacts,
          newContact
        } = serverlessCheckpointer.restoreState(_context, '_context', 'syncContact', serverlessCheckpointerState));
      }

      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return dest.getByObjectName('myContact').where('Email=\'' + myContact.Email + '\'').run();

          case 2:
            foundContacts = _context.sent;

            serverlessCheckpointer.checkpoint('syncingContact', total, serverlessCheckpointer.buildState(serverlessCheckpointerState, 'syncContact', {
              _context,
              myContact,
              dest,
              total,
              foundContacts,
              newContact
            }));

            if (!(foundContacts.length === 1)) {
              _context.next = 10;
              break;
            }

            _context.next = 7;
            return dest.replaceObjectNameByObjectId('myContact', foundContacts[0].Id, myContact).run();

          case 7:
            console.log(foundContacts[0].Id + ' updated');
            _context.next = 14;
            break;

          case 10:
            _context.next = 12;
            return dest.createByObjectName('myContact', myContact).run();

          case 12:
            newContact = _context.sent;

            console.log(newContact.Id + ' created');

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function syncContact(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var eventHandler = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    const serverlessCheckpointerState = serverlessCheckpointer.getState(arguments);

    var _configurator,
        trigger,
        config,
        i,
        event,
        myContact,
        _args2 = arguments;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      if (serverlessCheckpointer.continuing(serverlessCheckpointerState)) {
        ({
          _context2,
          _configurator,
          trigger,
          config,
          i,
          event,
          myContact,
          _args2
        } = serverlessCheckpointer.restoreState(_context2, '_context2', 'eventHandler', serverlessCheckpointerState));
      }

      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _configurator = configurator(_args2), trigger = _configurator.trigger, config = _configurator.config;

            serverlessCheckpointer.checkpoint('eventReceived', serverlessCheckpointer.buildState(serverlessCheckpointerState, 'eventHandler', {
              _context2,
              _configurator,
              trigger,
              config,
              i,
              event,
              myContact,
              _args2
            }));
            i = 0;

          case 3:
            if (!(i < trigger.events.length)) {
              _context2.next = 14;
              break;
            }

            event = trigger.events[i];
            _context2.next = 7;
            return config.source.getMyContactById(event.objectId).run();

          case 7:
            myContact = _context2.sent;

            if (!myContact.Email) {
              _context2.next = 11;
              break;
            }

            _context2.next = 11;
            return syncContact(myContact, config.dest, trigger.events.length, serverlessCheckpointer.buildState(serverlessCheckpointerState, 'eventHandler', {
              _context2,
              _configurator,
              trigger,
              config,
              i,
              event,
              myContact,
              _args2
            }));

          case 11:
            i++;
            _context2.next = 3;
            break;

          case 14:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function eventHandler() {
    return _ref2.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) {
  return function () {
    var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);var value = info.value;
        } catch (error) {
          reject(error);return;
        }if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }return step("next");
    });
  };
}

var _require = require('./configurator'),
    configurator = _require.configurator;

module.exports.eventHandler = serverlessCheckpointer.wrapper(eventHandler);
