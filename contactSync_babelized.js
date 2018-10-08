'use strict';

const serverlessCheckpointer = require('./serverlessCheckpointer');

var syncContact = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(myContact, config, total) {
    const serverlessCheckpointerState = serverlessCheckpointer.getState(arguments);

    var foundContacts, newContact;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      if (serverlessCheckpointer.continuing(serverlessCheckpointerState)) {
        ({
          _context,
          myContact,
          config,
          total,
          foundContacts,
          newContact
        } = serverlessCheckpointer.restoreState(_context, serverlessCheckpointerState));
      }

      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return config.dest.getByObjectName('myContact').where('Email=\'' + myContact.Email + '\'').run();

          case 2:
            foundContacts = _context.sent;

            serverlessCheckpointer.checkpoint('syncingContact', total, serverlessCheckpointer.buildState(serverlessCheckpointerState, {
              _context,
              myContact,
              config,
              total,
              foundContacts,
              newContact
            }));

            if (!(foundContacts.length === 1)) {
              _context.next = 10;
              break;
            }

            _context.next = 7;
            return config.dest.updateObjectNameByObjectId('myContact', foundContacts[0].Id, myContact).run();

          case 7:
            console.log(foundContacts[0].Id + ' updated');
            _context.next = 14;
            break;

          case 10:
            _context.next = 12;
            return config.dest.createByObjectName('myContact', myContact).run();

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
        done,
        _iteratorNormalCompletion,
        _didIteratorError,
        _iteratorError,
        _iterator,
        _step,
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
          done,
          _iteratorNormalCompletion,
          _didIteratorError,
          _iteratorError,
          _iterator,
          _step,
          event,
          myContact,
          _args2
        } = serverlessCheckpointer.restoreState(_context2, serverlessCheckpointerState));
      }

      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _configurator = configurator(_args2), trigger = _configurator.trigger, config = _configurator.config, done = _configurator.done;

            serverlessCheckpointer.checkpoint('eventReceived', serverlessCheckpointer.buildState(serverlessCheckpointerState, {
              _context2,
              _configurator,
              trigger,
              config,
              done,
              _iteratorNormalCompletion,
              _didIteratorError,
              _iteratorError,
              _iterator,
              _step,
              event,
              myContact,
              _args2
            }));
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 5;
            _iterator = trigger.events[Symbol.iterator]();

          case 7:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context2.next = 18;
              break;
            }

            event = _step.value;
            _context2.next = 11;
            return config.sfdc.getMyContactById(event.objectId).run();

          case 11:
            myContact = _context2.sent;

            if (!myContact.Email) {
              _context2.next = 15;
              break;
            }

            _context2.next = 15;
            return syncContact(myContact, config, trigger.events.length, serverlessCheckpointer.buildState(serverlessCheckpointerState, {
              _context2,
              _configurator,
              trigger,
              config,
              done,
              _iteratorNormalCompletion,
              _didIteratorError,
              _iteratorError,
              _iterator,
              _step,
              event,
              myContact,
              _args2
            }));

          case 15:
            _iteratorNormalCompletion = true;
            _context2.next = 7;
            break;

          case 18:
            _context2.next = 24;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2['catch'](5);
            _didIteratorError = true;
            _iteratorError = _context2.t0;

          case 24:
            _context2.prev = 24;
            _context2.prev = 25;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 27:
            _context2.prev = 27;

            if (!_didIteratorError) {
              _context2.next = 30;
              break;
            }

            throw _iteratorError;

          case 30:
            return _context2.finish(27);

          case 31:
            return _context2.finish(24);

          case 32:
            done();

          case 33:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[5, 20, 24, 32], [25,, 27, 31]]);
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