const pako = require('pako');

module.exports.wrapper = function(handler) {
  console.log('wrapping')
  let globalScope = {continuing: false, local: true}
  return async function () {
    console.log('wrapper', arguments)
    console.log('calling', handler)
    let done = false;
    let stack = []
    while (!done) {
      try {
        return await handler(...arguments, {globalScope, stack: stack})
      } catch (e) {
        console.log('caught', e)
        if (e.type === 'checkpoint') {
          console.log('closing time')
          done = !globalScope.local;
          globalScope.continuing = true;
          const serializedState = pako.inflate(e.state, {to: 'string'})
          stack = JSON.parse(serializedState).stack
          console.log('stack', stack)
        } else {
          throw e;
        }
      }
    }
  }
}

module.exports.continuing = function(state) {
  console.log('continuing', state)
  return state.globalScope.continuing;
}

module.exports.buildState = function(state, context) {
  console.log('buildState', state, context)
  return {globalScope: state.globalScope, stack: state.stack.concat([context])}
}

module.exports.checkpoint = function() {
  console.log('checkpoint', arguments)
  const state = module.exports.getState(arguments)
  const serializedState = JSON.stringify(state);
  const compressedState = pako.deflate(serializedState, {to: 'string'})
  console.log('state size:', serializedState.length, 'compressed state size:', compressedState.length)
  if (state.globalScope.continuing) {
    state.globalScope.continuing = false;
  } else {
    throw {type: 'checkpoint', state: compressedState}
  }
}


module.exports.getState = function (args) {
  const state = args[args.length-1]
  console.log('getState', state)
  return state
}


module.exports.restoreState = function(context, state) {
  console.log('restoreState', context, state)
  console.log(state.stack[0])
  return state.stack[0];
}