const pako = require('pako');
const {parse, stringify} = require('flatted/cjs');

function reviver(key, value) {
  if (typeof value === 'string' && value.match(/^\(\) *=>/)) {
    return eval(value)();
  } else {
    return value;
  }

}

module.exports.wrapper = function(handler) {
  let globalScope = {continuing: false, local: true}
  return async function () {
    console.log('wrapper', arguments[0])
    let done = false;
    let stack = {}
    while (!done) {
      try {
        return await handler(...arguments, {globalScope, stack: stack})
      } catch (e) {
        if (e.type === 'checkpoint') {
          done = !globalScope.local;
          globalScope.continuing = true;
          const serializedState = pako.inflate(e.state, {to: 'string'})
          stack = parse(serializedState, reviver).stack
          if (!done) {
            console.log('Restarting with state for', Object.keys(stack).join(', '))
          }
        } else {
          console.log('caught', e)
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
    return {globalScope: state.globalScope, stack: Object.assign(state.stack, {[functionName]: context})}
  }
}

module.exports.checkpoint = function() {
  const state = module.exports.getState(arguments)
  if (state.globalScope.continuing) {
    console.log('checkpoint', arguments[0], 'continuing...')
    state.globalScope.continuing = false;
  } else {
    const serializedState = stringify(state);
    const compressedState = pako.deflate(serializedState, {to: 'string'})
    console.log('checkpoint', arguments[0], 'reached - state size:', serializedState.length, 'compressed size:', compressedState.length)
    throw {type: 'checkpoint', state: compressedState}
  }
}


module.exports.getState = function (args) {
  const state = args[args.length-1]
  return state
}

module.exports.restoreState = function(context, contextName, functionName, state) {
  console.log('restoring state for', functionName)
  context.next = state.stack[functionName][contextName].prev;
  context.prev = state.stack[functionName][contextName].prev;
  context.sent = state.stack[functionName][contextName].sent;
  state.stack[functionName][contextName] = context;
  return state.stack[functionName];
}