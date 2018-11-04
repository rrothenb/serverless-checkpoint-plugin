require("regenerator-runtime/runtime");

const AWS = require('aws-sdk')

const pako = require('pako');
const {parse, stringify} = require('flatted/cjs');

function reviver(key, value) {
  if (value && value.checkpointedClassName && value.checkpointedRepresentation && revivers[value.checkpointedClassName]) {
    return revivers[value.checkpointedClassName](JSON.parse(value.checkpointedRepresentation))
  }
  return value
}

function replacer(key, value) {
  if (value && value.constructor && revivers[value.constructor.name]) {
    return {checkpointedClassName: value.constructor.name, checkpointedRepresentation: JSON.stringify(value)}
  }
  return value
}

module.exports.wrapper = function(handler) {
  let globalScope = {continuing: false, local: true}
  return async function (event, context, callback) {
    console.log('Starting at', `${new Date()}`)
    let done = false;
    let stack = {}
    if (event.Records && event.Records.length === 1 && event.Records[0].eventSource === 'aws:sqs') {
      globalScope.continuing = true;
      const compressedStack = Buffer.from(event.Records[0].body, 'base64').toString('utf-8')
      const serializedState = pako.inflate(compressedStack, {to: 'string'})
      stack = parse(serializedState, reviver).stack
      console.log('Restarting with state for', Object.keys(stack).join(', '))
    }
    while (!done) {
      try {
        const response = await handler(...arguments, {globalScope, stack: stack})
        console.log('Completed at', `${new Date()}`)
        return response
      } catch (e) {
        if (e.type === 'checkpoint') {
          if (context.invokedFunctionArn) {
            const region = context.invokedFunctionArn.split(':')[3]
            const account = context.invokedFunctionArn.split(':')[4]
            const sqs = new AWS.SQS({region})
            const queueUrl = `https://sqs.${region}.amazonaws.com/${account}/queue`
            return sqs.sendMessage(
              {
                MessageBody: Buffer.from(e.state).toString('base64'),
                QueueUrl: queueUrl
              }).promise().then(r => {
              callback(null, {statusCode: 202, body: 'checkpoint!'})
            })
          } else {
            globalScope.continuing = true;
            const serializedState = pako.inflate(e.state, {to: 'string'})
            stack = parse(serializedState, reviver).stack
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
    if (!state.stack['$checkpoint']) {
      state.stack['$checkpoint'] = {[arguments[0]]: {start: new Date(), done: 0}}
      console.log(`Reached ${arguments[0]} checkpoint`)
    } else {
      if (state.stack['$checkpoint'][arguments[0]]) {
        state.stack['$checkpoint'][arguments[0]].done++
        const numDone = state.stack['$checkpoint'][arguments[0]].done
        const numTotal = arguments[1]
        const numRemaining = numTotal - numDone
        const percentDone = Math.round(numDone*100/numTotal)
        const timeElapsed = new Date() - new Date(state.stack['$checkpoint'][arguments[0]].start)
        const estimateRemainingTime = Math.round(timeElapsed*numRemaining/numDone)
        const estimatedCompletionDate = new Date(new Date().getTime() + estimateRemainingTime)
        console.log(
          `Reached next ${arguments[0]} checkpoint.`,
          `${percentDone}% done.`,
          `Should finish by ${estimatedCompletionDate}`)
      } else {
        state.stack['$checkpoint'] = {[arguments[0]]: {start: new Date(), done: 0}}
        console.log(`Reached ${arguments[0]} checkpoint`)
      }
    }
    const serializedState = stringify(state, replacer);
    const compressedState = pako.deflate(serializedState, {to: 'string'})
    console.log('state size:', serializedState.length, 'compressed size:', compressedState.length)
    throw {type: 'checkpoint', state: compressedState}
  }
}


module.exports.getState = function (args) {
  const state = args[args.length-1]
  return state
}

module.exports.restoreState = function(context, contextName, functionName, state) {
  context.next = state.stack[functionName][contextName].prev;
  context.prev = state.stack[functionName][contextName].prev;
  context.sent = state.stack[functionName][contextName].sent;
  state.stack[functionName][contextName] = context;
  return state.stack[functionName];
}

const revivers = {}

module.exports.register = function(classDef, reviver) {
  revivers[classDef.name] = reviver
}