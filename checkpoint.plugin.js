const template = require('babel-template')

const insertedRestores = []
const insertedUpdates = []
function getVars(path) {
  const bindings = path.scope.parent.bindings
  return Object.keys(bindings).filter(key => bindings[key].kind !== 'local')
}

function buildStateList(vars, t) {
  return vars.map(v => t.objectProperty(t.identifier(v), t.identifier(v), false, true));
}

function processCall(path, functionName, t) {
  console.log('calling processCall', functionName, path.node.start)
  const blockPath = path.findParent(path => path.parentPath.node.type === 'BlockStatement' && path.parentPath.parent.type === 'FunctionExpression')
  const vars = getVars(blockPath).concat(getVars(blockPath.parentPath));
  if (!insertedUpdates.includes(path.node.start)) {
    path.node.arguments.push(t.callExpression(t.identifier('serverlessCheckpointer.getState'), [t.identifier('arguments')]))
    path.insertBefore(t.callExpression(t.identifier('serverlessCheckpointer.updateState'), [
      t.identifier('arguments'),
      t.objectExpression(buildStateList(vars, t))
    ]));
    insertedUpdates.push(path.node.start)
  }
  console.log('vars:', vars)
  if (!insertedRestores.includes(blockPath.node.start)) {
    const stateRestorer = template(`
            if (serverlessCheckpointer.continuing(arguments)) {
              (STATE = serverlessCheckpointer.restoreState(CONTEXT, arguments));
            }
        `,)( {
      STATE: t.objectPattern(buildStateList(vars, t)),
      CONTEXT: t.identifier(getVars(blockPath)[0])
    })
    console.log('blockPath.node.start', blockPath.node.start)
    blockPath.insertBefore(stateRestorer)
    insertedRestores.push(blockPath.node.start)
  }
  const a2gPath = path.findParent(path => path.node.callee && path.node.callee.name === '_asyncToGenerator');
  return a2gPath.findParent(path => path.node.callee && path.node.callee.type === 'FunctionExpression');
}

module.exports = function ({ types: t }) {
  return {
    visitor: {
      CallExpression(path, state) {
        if (path.node.callee.name !== '$checkpoint' || path.parentPath.parent.type !== 'SwitchCase') {
          return;
        }
        path.node.callee.name = 'serverlessCheckpointer.checkpoint';
        const functionPath = processCall(path, '$checkpoint', t)
        let functionName = functionPath.parent.id.name;
        console.log('functionName:', functionName)
        const topPath = functionPath.findParent(path => path.node.type === 'Program')
        let done = false;
        while (!done) {
          done = true;
          topPath.traverse({
            CallExpression(path, state) {
              if (path.node.callee.name !== functionName || path.parentPath.parent.type !== 'SwitchCase') {
                return;
              }
              const functionPath = processCall(path, functionName, t)
              functionName = functionPath.parent.id.name;
              console.log('functionName:', functionName)
              // TODO If no functionName, then must be top and can wrap it
              done = false;
            }
          });
        }
      },
      Program(path, state) {
        path.node.body.unshift(
          template("const SC = require('./serverlessCheckpointer')")({SC: t.identifier('serverlessCheckpointer')}))
      },
      AssignmentExpression(path, state) {
        if (path.node.right && path.node.right.name === 'eventHandler') {
          console.log('AssignmentExpression - path.node.right:', path.node.right)
          console.log('AssignmentExpression - state.opts:', state.opts)
        }
      }
    }
  };
};

/*

Next: insert code to wrap eventHandler based on presence of checkpoint (not serverless.yml)
That will mean removing the visitor for AssignmentExpression or moving it to within CallExpression

 */