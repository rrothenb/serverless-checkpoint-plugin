module.exports.wrapper = function(handler) {
  console.log('wrapping')
  return function() {
    console.log('wrapper', arguments)
    return handler(...arguments, {state: 'blah'})
  }
}

module.exports.continuing = function() {
  console.log('continuing', getState(...arguments))
  return false;
}

module.exports.updateState = function(args, state) {
  console.log('updateState', getState(args), state)
}

module.exports.checkpoint = function() {
  console.log('checkpoint', arguments)
}

function getState(args) {
  const state = args[args.length-1]
  console.log('getState', state)
  return state
}

module.exports.getState = getState;

