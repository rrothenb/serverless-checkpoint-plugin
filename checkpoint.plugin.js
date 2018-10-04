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
        //path.findParent(path => {console.log('--- parent path ---');console.log(path); return !path})
        const blockPath = path.findParent(path => path.parentPath.node.type === 'BlockStatement' && path.parentPath.parent.type === 'FunctionExpression')
        blockPath.addComment(
          'leading',
          ' TODO need to recognize when the context is being passed in and use it and also set the variables',
          true)
        const vars = getVars(blockPath).concat(getVars(blockPath.parentPath));
        console.log('vars:', vars)
        const a2gPath = path.findParent(path => path.node.callee && path.node.callee.name === '_asyncToGenerator');
        const functionPath = a2gPath.findParent(path => path.node.callee && path.node.callee.type === 'FunctionExpression');
        const functionName = functionPath.parent.id.name;
        console.log('functionName:', functionName)
        const topPath = functionPath.findParent(path => path.node.type === 'Program')
        topPath.traverse({
          CallExpression(path, state) {
            if (path.node.callee.name !== functionName || path.parentPath.parent.type !== 'SwitchCase') {
              return;
            }
            const a2gPath = path.findParent(path => path.node.callee && path.node.callee.name === '_asyncToGenerator');
            const functionPath = a2gPath.findParent(path => path.node.callee && path.node.callee.type === 'FunctionExpression');
            console.log('functionPath.parent.id.name:', functionPath.parent.id.name)
          }
        });
        path.node.arguments.push(t.identifier('arguments'))
        path.node.callee.name = 'serverlessCheckpointer.checkpoint';
        path.insertBefore(t.callExpression(t.identifier('serverlessCheckpointer.updateState'), [
          t.identifier('arguments'),
          buildStateObject(vars, t)
        ]));
      },
      Program(path, state) {
        console.log('Program - path.node.body:', path.node.body)
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

