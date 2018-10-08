module.exports.wrapper = function(handler) {
  console.log('wrapping')
  let globalScope = {continuing: false}
  return function() {
    console.log('wrapper', arguments)
    return handler(...arguments, {globalScope})
  }
}

module.exports.continuing = function(state) {
  console.log('continuing', state)
  return state.globalScope.continuing;
}

module.exports.buildState = function(state, context) {
  console.log('buildState', state, JSON.stringify(context, null, 4))
  return state
}

module.exports.checkpoint = function() {
  console.log('checkpoint', arguments)
  const state = module.exports.getState(arguments)
  throw {type: 'checkpoint', state: state}
}


module.exports.getState = function (args) {
  const state = args[args.length-1]
  console.log('getState', state)
  return state
}


