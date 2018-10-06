const template = require('babel-template')

function getVars(path) {
  const bindings = path.scope.parent.bindings
  return Object.keys(bindings).filter(key => bindings[key].kind !== 'local')
}

function buildStateObject(vars, t) {
  return t.objectExpression(vars.map(v => t.objectProperty(t.identifier(v), t.identifier(v), false, true)));
}

module.exports = function ({ types: t }) {
  return {
    visitor: {
      CallExpression(path, state) {
        if (path.node.callee.name !== '$checkpoint' || path.parentPath.parent.type !== 'SwitchCase') {
          return;
        }
        const blockPath = path.findParent(path => path.parentPath.node.type === 'BlockStatement' && path.parentPath.parent.type === 'FunctionExpression')
        const vars = getVars(blockPath).concat(getVars(blockPath.parentPath));
        path.node.arguments.push(t.identifier('arguments'))
        path.node.callee.name = 'serverlessCheckpointer.checkpoint';
        path.insertBefore(t.callExpression(t.identifier('serverlessCheckpointer.updateState'), [
          t.identifier('arguments'),
          buildStateObject(vars, t)
        ]));
        console.log('vars:', vars)
        const stateRestorer = template(`
            if (serverlessCheckpointer.continuing(arguments)) {
              (STATE = serverlessCheckpointer.restoreState(CONTEXT, arguments));
            }
        `,)( {
          STATE: t.objectPattern(vars.map(v => t.objectProperty(t.identifier(v), t.identifier(v), false, true))),
          CONTEXT: t.identifier(getVars(blockPath)[0])
        })
        blockPath.insertBefore(stateRestorer)
        const a2gPath = path.findParent(path => path.node.callee && path.node.callee.name === '_asyncToGenerator');
        const functionPath = a2gPath.findParent(path => path.node.callee && path.node.callee.type === 'FunctionExpression');
        const functionName = functionPath.parent.id.name;
        console.log('functionName:', functionName)
        const topPath = functionPath.findParent(path => path.node.type === 'Program')
        // TODO this goes in a while loop as long as functionName is set
        topPath.traverse({
          CallExpression(path, state) {
            if (path.node.callee.name !== functionName || path.parentPath.parent.type !== 'SwitchCase') {
              return;
            }
            // TODO here is where we add the update state and stateRestorer (and probably avoid duplication)
            // TODO need to factor out common code between here and above
            const a2gPath = path.findParent(path => path.node.callee && path.node.callee.name === '_asyncToGenerator');
            const functionPath = a2gPath.findParent(path => path.node.callee && path.node.callee.type === 'FunctionExpression');
            console.log('functionPath.parent.id.name:', functionPath.parent.id.name)
            // TODO here is where we know that we're being called by eventHandler
            // TODO If no functionPath.parent.id.name, then functionName must be top and can wrap it
          }
        });
      },
      Program(path, state) {
        console.log('Program - path.node.body:', path.node.body)
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