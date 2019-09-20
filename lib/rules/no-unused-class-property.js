/**
 * @fileoverview Prevent declaring unused methods of component class
 * @author Berton Zhu
 */

const Components = require('eslint-plugin-react/lib/util/Components');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const LIFECYCLE_METHODS = new Set([
  'constructor',
  'componentWillMount',
  'UNSAFE_componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'UNSAFE_componentWillReceiveProps',
  'shouldComponentUpdate',
  'componentWillUpdate',
  'UNSAFE_componentWillUpdate',
  'render',
  'componentDidUpdate',
  'componentDidCatch',
  'componentWillUnmount',
]);

function isKeyLiteralLike(node, property) {
  return property.type === 'Literal' ||
    (property.type === 'TemplateLiteral' && property.expressions.length === 0) ||
    (node.computed === false && property.type === 'Identifier');
}

// Descend through all wrapping TypeCastExpressions and return the expression
// that was cast.
function uncast(node) {
  while (node.type === 'TypeCastExpression') {
    node = node.expression;
  }
  return node;
}

// Return the name of an identifier or the string value of a literal. Useful
// anywhere that a literal may be used as a key (e.g., member expressions,
// method definitions, ObjectExpression property keys).
function getName(node) {
  node = uncast(node);
  const type = node.type;

  if (type === 'Identifier') {
    return node.name;
  }
  if (type === 'Literal') {
    return String(node.value);
  }
  if (type === 'TemplateLiteral' && node.expressions.length === 0) {
    return node.quasis[0].value.raw;
  }
  return null;
}

function isThisExpression(node) {
  return uncast(node).type === 'ThisExpression';
}

function getInitialClassInfo(node) {
  return {
    classNode: node,
    // Set of nodes where properties were defined.
    properties: new Set(),

    // Set of names of properties that we've seen used.
    usedProperties: new Set(),

    inStatic: false,
  };
}

module.exports = {
  meta: {
    docs: {
      description: 'Prevent definition of unused component properties and methods',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [],
  },

  create: Components.detect((context, components, utils) => {
    let classInfo = null;

    // Takes an ObjectExpression node and adds all named Property nodes to the
    // current set of properties.
    function addProperty(node) {
      classInfo.properties.add(node);
    }

    // Adds the name of the given node as a used property if the node is an
    // Identifier or a Literal. Other node types are ignored.
    function addUsedProperty(node) {
      const name = getName(node);
      if (name) {
        classInfo.usedProperties.add(name);
      }
    }

    function reportUnusedProperties() {
      // Report all unused properties.
      for (const node of classInfo.properties) { // eslint-disable-line no-restricted-syntax
        const name = getName(node);
        if (
          !classInfo.usedProperties.has(name) &&
          !LIFECYCLE_METHODS.has(name)
        ) {
          context.report({
            node,
            message: 'Unused method or property "{{method}}" of class "{{class}}"',
            data: {
              class: classInfo.classNode.id.name,
              method: name,
            },
          });
        }
      }
    }

    function exitMethod() {
      if (!classInfo || !classInfo.inStatic) {
        return;
      }

      classInfo.inStatic = false;
    }

    return {
      ClassDeclaration(node) {
        if (utils.isES6Component(node)) {
          classInfo = getInitialClassInfo(node);
        }
      },

      'ClassDeclaration:exit': function () {
        if (!classInfo) {
          return;
        }
        reportUnusedProperties();
        classInfo = null;
      },

      'ClassProperty, MethodDefinition': function (node) {
        if (!classInfo) {
          return;
        }

        if (node.static) {
          classInfo.inStatic = true;
          return;
        }

        if (isKeyLiteralLike(node, node.key)) {
          addProperty(node.key);
        }
      },

      'ClassProperty:exit': exitMethod,
      'MethodDefinition:exit': exitMethod,

      MemberExpression(node) {
        if (!classInfo || classInfo.inStatic) {
          return;
        }

        if (isThisExpression(node.object) && isKeyLiteralLike(node, node.property)) {
          if (node.parent.type === 'AssignmentExpression' && node.parent.left === node) {
            // detect `this.property = xxx`
            addProperty(node.property);
          } else {
            // detect `this.property()`, `x = this.property`, etc.
            addUsedProperty(node.property);
          }
        }
      },

      VariableDeclarator(node) {
        if (!classInfo || classInfo.inStatic) {
          return;
        }

        // detect `{ foo, bar: baz } = this`
        if (node.init && isThisExpression(node.init) && node.id.type === 'ObjectPattern') {
          node.id.properties.forEach((prop) => {
            if (prop.type === 'Property' && isKeyLiteralLike(prop, prop.key)) {
              addUsedProperty(prop.key);
            }
          });
        }
      },
    };
  }),
};
