const template = require('babel-template')

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
        console.log('scope:', Object.keys(blockPath.scope.parent.bindings))
        console.log('scope:', Object.keys(blockPath.parentPath.scope.parent.bindings))
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
        path.addComment(
          'leading',
          ' TODO if coming indirectly to this step and not past threshold, write out state to SQS and exit/throw',
          true)
        path.addComment(
          'leading',
          ' TODO if coming indirectly to this step and past threshold write out state to DLQ and exit/throw',
          true)
        path.addComment(
          'leading',
          ' TODO if coming directly to this step, just keep going',
          true)
      }
    }
  };
};

