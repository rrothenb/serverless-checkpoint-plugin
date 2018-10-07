module.exports.wrapper = function(handler) {
  console.log('wrapping')
  return function() {
    console.log('wrapper', arguments)
    return handler(...arguments, {state: 'blah'})
  }
}

module.exports.continuing = function(state) {
  console.log('continuing', state)
  return false;
}

module.exports.updateState = function(args, state) {
  console.log('updateState', args, state)
}

module.exports.checkpoint = function() {
  console.log('checkpoint', arguments)
}


module.exports.getState = function (args) {
  const state = args[args.length-1]
  console.log('getState', state)
  return state
}


