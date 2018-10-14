const pako = require('pako');

module.exports.wrapper = function(handler) {
  let globalScope = {continuing: false, local: true}
  return async function () {
    console.log('wrapper', arguments)
    let done = false;
    let stack = {}
    while (!done) {
      try {
        return await handler(...arguments, {globalScope, stack: stack})
      } catch (e) {
        console.log('caught', e)
        if (e.type === 'checkpoint') {
          done = !globalScope.local;
          globalScope.continuing = true;
          const serializedState = pako.inflate(e.state, {to: 'string'})
          stack = JSON.parse(serializedState).stack
        } else {
          throw e;
        }
      }
    }
  }
}

module.exports.continuing = function(state) {
  return state.globalScope.continuing;
}

module.exports.buildState = function(state, functionName, context) {
  if (state.globalScope.continuing) {
    return state
  } else {
    return {globalScope: state.globalScope, stack: Object.assign({[functionName]: context}, state.stack)}
  }
}

module.exports.checkpoint = function() {
  const state = module.exports.getState(arguments)
  const serializedState = JSON.stringify(state);
  const compressedState = pako.deflate(serializedState, {to: 'string'})
  if (state.globalScope.continuing) {
    state.globalScope.continuing = false;
  } else {
    throw {type: 'checkpoint', state: compressedState}
  }
}


module.exports.getState = function (args) {
  const state = args[args.length-1]
  return state
}

module.exports.restoreState = function(context, contextName, functionName, state) {
  context.next = state.stack[functionName][contextName].next;
  context.prev = state.stack[functionName][contextName].prev;
  state.stack[functionName][contextName] = context;
  return state.stack[functionName];
}