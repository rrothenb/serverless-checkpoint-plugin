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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRhY3RTeW5jLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O3FFQUVBLFNBQUEsT0FBQSxDQUFBLFNBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxFQUFBO0FBQUE7O0FBQUEsUUFBQSxhQUFBLEVBQUEsVUFBQTtBQUFBLFdBQUEsbUJBQUEsSUFBQSxDQUFBLFNBQUEsUUFBQSxDQUFBLFFBQUEsRUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBLGFBQUEsQ0FBQSxFQUFBO0FBQUEsZ0JBQUEsU0FBQSxJQUFBLEdBQUEsU0FBQSxJQUFBO0FBQUEsZUFBQSxDQUFBO0FBQUEscUJBQUEsSUFBQSxHQUFBLENBQUE7QUFBQSxtQkFDOEIsS0FBQSxlQUFBLENBQUEsV0FBQSxFQUFBLEtBQUEsQ0FBQSxhQUFrRCxVQUFsRCxLQUFBLEdBQUEsSUFBQSxFQUQ5QixHQUM4QixFQUQ5Qjs7QUFBQSxlQUFBLENBQUE7QUFBQSw0QkFBQSxTQUFBLElBQUE7O0FBRUUsOENBQUEsZ0JBQUEsRUFBQSxLQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBRkYsZ0JBQUEsRUFHTSxjQUFBLE1BQUEsS0FITixDQUFBLENBQUEsRUFBQTtBQUFBLHVCQUFBLElBQUEsR0FBQSxFQUFBO0FBQUE7QUFBQTs7QUFBQSxxQkFBQSxJQUFBLEdBQUEsQ0FBQTtBQUFBLG1CQUlVLEtBQUEsMkJBQUEsQ0FBQSxXQUFBLEVBQThDLGNBQUEsQ0FBQSxFQUE5QyxFQUFBLEVBQUEsU0FBQSxFQUpWLEdBSVUsRUFKVjs7QUFBQSxlQUFBLENBQUE7QUFLSSxvQkFBQSxHQUFBLENBQWUsY0FBQSxDQUFBLEVBQWYsRUFBZSxHQUFmLFVBQUE7QUFMSixxQkFBQSxJQUFBLEdBQUEsRUFBQTtBQUFBOztBQUFBLGVBQUEsRUFBQTtBQUFBLHFCQUFBLElBQUEsR0FBQSxFQUFBO0FBQUEsbUJBTzZCLEtBQUEsa0JBQUEsQ0FBQSxXQUFBLEVBQUEsU0FBQSxFQVA3QixHQU82QixFQVA3Qjs7QUFBQSxlQUFBLEVBQUE7QUFBQSx5QkFBQSxTQUFBLElBQUE7O0FBUUksb0JBQUEsR0FBQSxDQUFlLFdBQWYsRUFBZSxHQUFmLFVBQUE7O0FBUkosZUFBQSxFQUFBO0FBQUEsZUFBQSxLQUFBO0FBQUEsbUJBQUEsU0FBQSxJQUFBLEVBQUE7QUFBQTtBQUFBO0FBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLENBQUE7OztrQkFBZSxXOzs7Ozs7c0VBWWYsU0FBQSxRQUFBLEdBQUE7QUFBQTs7QUFBQSxRQUFBLGFBQUE7QUFBQSxRQUFBLE9BQUE7QUFBQSxRQUFBLE1BQUE7QUFBQSxRQUFBLENBQUE7QUFBQSxRQUFBLEtBQUE7QUFBQSxRQUFBLFNBQUE7QUFBQSxRQUFBLFNBQUEsU0FBQTs7QUFBQSxXQUFBLG1CQUFBLElBQUEsQ0FBQSxTQUFBLFNBQUEsQ0FBQSxTQUFBLEVBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUEsYUFBQSxDQUFBLEVBQUE7QUFBQSxnQkFBQSxVQUFBLElBQUEsR0FBQSxVQUFBLElBQUE7QUFBQSxlQUFBLENBQUE7QUFBQSw0QkFDNEIsYUFENUIsTUFDNEIsQ0FENUIsRUFBQSxVQUFBLGNBQUEsT0FBQSxFQUFBLFNBQUEsY0FBQSxNQUFBOztBQUVFLDhDQUFBLGVBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFGRixnQkFBQSxDQUFBOztBQUFBLGVBQUEsQ0FBQTtBQUFBLGdCQUFBLEVBR2tCLElBQUksUUFBQSxNQUFBLENBSHRCLE1BQUEsQ0FBQSxFQUFBO0FBQUEsd0JBQUEsSUFBQSxHQUFBLEVBQUE7QUFBQTtBQUFBOztBQUFBLG9CQUlrQixRQUFBLE1BQUEsQ0FKbEIsQ0FJa0IsQ0FKbEI7QUFBQSxzQkFBQSxJQUFBLEdBQUEsQ0FBQTtBQUFBLG1CQUs0QixPQUFBLE1BQUEsQ0FBQSxnQkFBQSxDQUErQixNQUEvQixRQUFBLEVBTDVCLEdBSzRCLEVBTDVCOztBQUFBLGVBQUEsQ0FBQTtBQUFBLHdCQUFBLFVBQUEsSUFBQTs7QUFBQSxnQkFBQSxDQU1RLFVBTlIsS0FBQSxFQUFBO0FBQUEsd0JBQUEsSUFBQSxHQUFBLEVBQUE7QUFBQTtBQUFBOztBQUFBLHNCQUFBLElBQUEsR0FBQSxFQUFBO0FBQUEsbUJBT1ksWUFBQSxTQUFBLEVBQXVCLE9BQXZCLElBQUEsRUFBb0MsUUFBQSxNQUFBLENBUGhELE1BT1k7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFQWjs7QUFBQSxlQUFBLEVBQUE7QUFBQTtBQUFBLHNCQUFBLElBQUEsR0FBQSxDQUFBO0FBQUE7O0FBQUEsZUFBQSxFQUFBO0FBQUEsZUFBQSxLQUFBO0FBQUEsbUJBQUEsVUFBQSxJQUFBLEVBQUE7QUFBQTtBQUFBO0FBQUEsS0FBQSxFQUFBLFFBQUEsRUFBQSxJQUFBLENBQUE7OztrQkFBZSxZOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7ZUFkUSxRQUFBLGdCQUFBLEM7SUFBaEIsZSxTQUFBLFk7O0FBMEJQLE9BQUEsT0FBQSxDQUFBLFlBQUEsa0NBQUEsWUFBQSIsImZpbGUiOiJjb250YWN0U3luY19iYWJlbGl6ZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7Y29uZmlndXJhdG9yfSA9IHJlcXVpcmUoJy4vY29uZmlndXJhdG9yJyk7XG5cbmFzeW5jIGZ1bmN0aW9uIHN5bmNDb250YWN0KG15Q29udGFjdCwgZGVzdCwgdG90YWwpIHtcbiAgY29uc3QgZm91bmRDb250YWN0cyA9IGF3YWl0IGRlc3QuZ2V0QnlPYmplY3ROYW1lKCdteUNvbnRhY3QnKS53aGVyZShgRW1haWw9JyR7bXlDb250YWN0LkVtYWlsfSdgKS5ydW4oKTtcbiAgJGNoZWNrcG9pbnQoJ3N5bmNpbmdDb250YWN0JywgdG90YWwpO1xuICBpZiAoZm91bmRDb250YWN0cy5sZW5ndGggPT09IDEpIHtcbiAgICBhd2FpdCBkZXN0LnJlcGxhY2VPYmplY3ROYW1lQnlPYmplY3RJZCgnbXlDb250YWN0JywgZm91bmRDb250YWN0c1swXS5JZCwgbXlDb250YWN0KS5ydW4oKTtcbiAgICBjb25zb2xlLmxvZyhgJHtmb3VuZENvbnRhY3RzWzBdLklkfSB1cGRhdGVkYCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgbmV3Q29udGFjdCA9IGF3YWl0IGRlc3QuY3JlYXRlQnlPYmplY3ROYW1lKCdteUNvbnRhY3QnLCBteUNvbnRhY3QpLnJ1bigpO1xuICAgIGNvbnNvbGUubG9nKGAke25ld0NvbnRhY3QuSWR9IGNyZWF0ZWRgKTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBldmVudEhhbmRsZXIoKSB7XG4gIGNvbnN0IHt0cmlnZ2VyLCBjb25maWd9ID0gY29uZmlndXJhdG9yKGFyZ3VtZW50cyk7XG4gICRjaGVja3BvaW50KCdldmVudFJlY2VpdmVkJyk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdHJpZ2dlci5ldmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBldmVudCA9IHRyaWdnZXIuZXZlbnRzW2ldO1xuICAgIGNvbnN0IG15Q29udGFjdCA9IGF3YWl0IGNvbmZpZy5zb3VyY2UuZ2V0TXlDb250YWN0QnlJZChldmVudC5vYmplY3RJZCkucnVuKCk7XG4gICAgaWYgKG15Q29udGFjdC5FbWFpbCkge1xuICAgICAgYXdhaXQgc3luY0NvbnRhY3QobXlDb250YWN0LCBjb25maWcuZGVzdCwgdHJpZ2dlci5ldmVudHMubGVuZ3RoKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMuZXZlbnRIYW5kbGVyID0gZXZlbnRIYW5kbGVyO1xuIl19