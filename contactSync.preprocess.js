'use strict';

var syncContact = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(myContact, config, total) {
    var foundContacts, newContact;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return config.dest.getByObjectName('myContact').where('Email=\'' + myContact.Email + '\'').run();

          case 2:
            foundContacts = _context.sent;

            $checkpoint('syncingContact', total);

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
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _configurator = configurator(_args2), trigger = _configurator.trigger, config = _configurator.config, done = _configurator.done;

            $checkpoint('eventReceived');
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
            return syncContact(myContact, config, trigger.events.length);

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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('./configurator'),
    configurator = _require.configurator;

module.exports.eventHandler = eventHandler;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRhY3RTeW5jLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztxRUFFQSxpQkFBMkIsU0FBM0IsRUFBc0MsTUFBdEMsRUFBOEMsS0FBOUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFDNEIsT0FBTyxJQUFQLENBQVksZUFBWixDQUE0QixXQUE1QixFQUF5QyxLQUF6QyxjQUF5RCxVQUFVLEtBQW5FLFNBQTZFLEdBQTdFLEVBRDVCOztBQUFBO0FBQ00seUJBRE47O0FBRUUsd0JBQVksZ0JBQVosRUFBOEIsS0FBOUI7O0FBRkYsa0JBR00sY0FBYyxNQUFkLEtBQXlCLENBSC9CO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsbUJBSVUsT0FBTyxJQUFQLENBQVksMEJBQVosQ0FBdUMsV0FBdkMsRUFBb0QsY0FBYyxDQUFkLEVBQWlCLEVBQXJFLEVBQXlFLFNBQXpFLEVBQW9GLEdBQXBGLEVBSlY7O0FBQUE7QUFLSSxvQkFBUSxHQUFSLENBQWUsY0FBYyxDQUFkLEVBQWlCLEVBQWhDO0FBTEo7QUFBQTs7QUFBQTtBQUFBO0FBQUEsbUJBTzZCLE9BQU8sSUFBUCxDQUFZLGtCQUFaLENBQStCLFdBQS9CLEVBQTRDLFNBQTVDLEVBQXVELEdBQXZELEVBUDdCOztBQUFBO0FBT1Usc0JBUFY7O0FBUUksb0JBQVEsR0FBUixDQUFlLFdBQVcsRUFBMUI7O0FBUko7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRzs7a0JBQWUsVzs7Ozs7O3NFQVlmO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsNEJBQ2tDLG9CQURsQyxFQUNTLE9BRFQsaUJBQ1MsT0FEVCxFQUNrQixNQURsQixpQkFDa0IsTUFEbEIsRUFDMEIsSUFEMUIsaUJBQzBCLElBRDFCOztBQUVFLHdCQUFZLGVBQVo7QUFGRjtBQUFBO0FBQUE7QUFBQTtBQUFBLHdCQUdvQixRQUFRLE1BSDVCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBR1csaUJBSFg7QUFBQTtBQUFBLG1CQUk0QixPQUFPLElBQVAsQ0FBWSxnQkFBWixDQUE2QixNQUFNLFFBQW5DLEVBQTZDLEdBQTdDLEVBSjVCOztBQUFBO0FBSVUscUJBSlY7O0FBQUEsaUJBS1EsVUFBVSxLQUxsQjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLG1CQU1ZLFlBQVksU0FBWixFQUF1QixNQUF2QixFQUErQixRQUFRLE1BQVIsQ0FBZSxNQUE5QyxDQU5aOztBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFTRTs7QUFURjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHOztrQkFBZSxZOzs7Ozs7O2VBZFEsUUFBUSxnQkFBUixDO0lBQWhCLFksWUFBQSxZOztBQTBCUCxPQUFPLE9BQVAsQ0FBZSxZQUFmLEdBQThCLFlBQTlCIiwiZmlsZSI6ImNvbnRhY3RTeW5jLnByZXByb2Nlc3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7Y29uZmlndXJhdG9yfSA9IHJlcXVpcmUoJy4vY29uZmlndXJhdG9yJyk7XG5cbmFzeW5jIGZ1bmN0aW9uIHN5bmNDb250YWN0KG15Q29udGFjdCwgY29uZmlnLCB0b3RhbCkge1xuICBsZXQgZm91bmRDb250YWN0cyA9IGF3YWl0IGNvbmZpZy5kZXN0LmdldEJ5T2JqZWN0TmFtZSgnbXlDb250YWN0Jykud2hlcmUoYEVtYWlsPScke215Q29udGFjdC5FbWFpbH0nYCkucnVuKCk7XG4gICRjaGVja3BvaW50KCdzeW5jaW5nQ29udGFjdCcsIHRvdGFsKTtcbiAgaWYgKGZvdW5kQ29udGFjdHMubGVuZ3RoID09PSAxKSB7XG4gICAgYXdhaXQgY29uZmlnLmRlc3QudXBkYXRlT2JqZWN0TmFtZUJ5T2JqZWN0SWQoJ215Q29udGFjdCcsIGZvdW5kQ29udGFjdHNbMF0uSWQsIG15Q29udGFjdCkucnVuKCk7XG4gICAgY29uc29sZS5sb2coYCR7Zm91bmRDb250YWN0c1swXS5JZH0gdXBkYXRlZGApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG5ld0NvbnRhY3QgPSBhd2FpdCBjb25maWcuZGVzdC5jcmVhdGVCeU9iamVjdE5hbWUoJ215Q29udGFjdCcsIG15Q29udGFjdCkucnVuKCk7XG4gICAgY29uc29sZS5sb2coYCR7bmV3Q29udGFjdC5JZH0gY3JlYXRlZGApO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGV2ZW50SGFuZGxlcigpIHtcbiAgY29uc3Qge3RyaWdnZXIsIGNvbmZpZywgZG9uZX0gPSBjb25maWd1cmF0b3IoYXJndW1lbnRzKTtcbiAgJGNoZWNrcG9pbnQoJ2V2ZW50UmVjZWl2ZWQnKTtcbiAgZm9yIChsZXQgZXZlbnQgb2YgdHJpZ2dlci5ldmVudHMpIHtcbiAgICBjb25zdCBteUNvbnRhY3QgPSBhd2FpdCBjb25maWcuc2ZkYy5nZXRNeUNvbnRhY3RCeUlkKGV2ZW50Lm9iamVjdElkKS5ydW4oKTtcbiAgICBpZiAobXlDb250YWN0LkVtYWlsKSB7XG4gICAgICBhd2FpdCBzeW5jQ29udGFjdChteUNvbnRhY3QsIGNvbmZpZywgdHJpZ2dlci5ldmVudHMubGVuZ3RoKTtcbiAgICB9XG4gIH1cbiAgZG9uZSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5ldmVudEhhbmRsZXIgPSBldmVudEhhbmRsZXI7XG4iXX0=