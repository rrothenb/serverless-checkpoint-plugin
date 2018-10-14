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
        } = serverlessCheckpointer.restoreState(_context, '_context', 'syncContact', serverlessCheckpointerState));
      }

      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return config.dest.getByObjectName('myContact').where('Email=\'' + myContact.Email + '\'').run();

          case 2:
            foundContacts = _context.sent;

            serverlessCheckpointer.checkpoint('syncingContact', total, serverlessCheckpointer.buildState(serverlessCheckpointerState, 'syncContact', {
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
        } = serverlessCheckpointer.restoreState(_context2, '_context2', 'eventHandler', serverlessCheckpointerState));
      }

      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _configurator = configurator(_args2), trigger = _configurator.trigger, config = _configurator.config, done = _configurator.done;

            serverlessCheckpointer.checkpoint('eventReceived', serverlessCheckpointer.buildState(serverlessCheckpointerState, 'eventHandler', {
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
            return syncContact(myContact, config, trigger.events.length, serverlessCheckpointer.buildState(serverlessCheckpointerState, 'eventHandler', {
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LElBQUEsVUFBQSxNQUFBLEVBQUE7QUFBQSx3QkFBQSxNQUFBO0FBQUE7O0FBQUEsZUFBQSxFQUFBO0FBQUEsc0JBQUEsSUFBQSxHQUFBLEVBQUE7O0FBQUEsZ0JBQUEsQ0FBQSxpQkFBQSxFQUFBO0FBQUEsd0JBQUEsSUFBQSxHQUFBLEVBQUE7QUFBQTtBQUFBOztBQUFBLGtCQUFBLGNBQUE7O0FBQUEsZUFBQSxFQUFBO0FBQUEsbUJBQUEsVUFBQSxNQUFBLENBQUEsRUFBQSxDQUFBOztBQUFBLGVBQUEsRUFBQTtBQUFBLG1CQUFBLFVBQUEsTUFBQSxDQUFBLEVBQUEsQ0FBQTs7QUFBQSxlQUFBLEVBQUE7QUFTRTs7QUFURixlQUFBLEVBQUE7QUFBQSxlQUFBLEtBQUE7QUFBQSxtQkFBQSxVQUFBLElBQUEsRUFBQTtBQUFBO0FBQUE7QUFBQSxLQUFBLEVBQUEsUUFBQSxFQUFBLElBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsQ0FBQSxDQUFBLENBQUE7OztrQkFBZSxZOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7ZUFkUSxRQUFBLGdCQUFBLEM7SUFBaEIsZSxTQUFBLFk7O0FBMEJQLE9BQUEsT0FBQSxDQUFBLFlBQUEsa0NBQUEsWUFBQSIsImZpbGUiOiJjb250YWN0U3luY19iYWJlbGl6ZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7Y29uZmlndXJhdG9yfSA9IHJlcXVpcmUoJy4vY29uZmlndXJhdG9yJyk7XG5cbmFzeW5jIGZ1bmN0aW9uIHN5bmNDb250YWN0KG15Q29udGFjdCwgY29uZmlnLCB0b3RhbCkge1xuICBsZXQgZm91bmRDb250YWN0cyA9IGF3YWl0IGNvbmZpZy5kZXN0LmdldEJ5T2JqZWN0TmFtZSgnbXlDb250YWN0Jykud2hlcmUoYEVtYWlsPScke215Q29udGFjdC5FbWFpbH0nYCkucnVuKCk7XG4gICRjaGVja3BvaW50KCdzeW5jaW5nQ29udGFjdCcsIHRvdGFsKTtcbiAgaWYgKGZvdW5kQ29udGFjdHMubGVuZ3RoID09PSAxKSB7XG4gICAgYXdhaXQgY29uZmlnLmRlc3QudXBkYXRlT2JqZWN0TmFtZUJ5T2JqZWN0SWQoJ215Q29udGFjdCcsIGZvdW5kQ29udGFjdHNbMF0uSWQsIG15Q29udGFjdCkucnVuKCk7XG4gICAgY29uc29sZS5sb2coYCR7Zm91bmRDb250YWN0c1swXS5JZH0gdXBkYXRlZGApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG5ld0NvbnRhY3QgPSBhd2FpdCBjb25maWcuZGVzdC5jcmVhdGVCeU9iamVjdE5hbWUoJ215Q29udGFjdCcsIG15Q29udGFjdCkucnVuKCk7XG4gICAgY29uc29sZS5sb2coYCR7bmV3Q29udGFjdC5JZH0gY3JlYXRlZGApO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGV2ZW50SGFuZGxlcigpIHtcbiAgY29uc3Qge3RyaWdnZXIsIGNvbmZpZywgZG9uZX0gPSBjb25maWd1cmF0b3IoYXJndW1lbnRzKTtcbiAgJGNoZWNrcG9pbnQoJ2V2ZW50UmVjZWl2ZWQnKTtcbiAgZm9yIChsZXQgZXZlbnQgb2YgdHJpZ2dlci5ldmVudHMpIHtcbiAgICBjb25zdCBteUNvbnRhY3QgPSBhd2FpdCBjb25maWcuc2ZkYy5nZXRNeUNvbnRhY3RCeUlkKGV2ZW50Lm9iamVjdElkKS5ydW4oKTtcbiAgICBpZiAobXlDb250YWN0LkVtYWlsKSB7XG4gICAgICBhd2FpdCBzeW5jQ29udGFjdChteUNvbnRhY3QsIGNvbmZpZywgdHJpZ2dlci5ldmVudHMubGVuZ3RoKTtcbiAgICB9XG4gIH1cbiAgZG9uZSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5ldmVudEhhbmRsZXIgPSBldmVudEhhbmRsZXI7XG4iXX0=