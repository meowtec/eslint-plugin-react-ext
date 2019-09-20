/**
 * @fileoverview Prevent declaring unused methods of component class
 * @author Berton Zhu
 */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-unused-class-property');
const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-unused-class-component-methods', rule, {
  valid: [
    {
      code: `
        class SmockTestForTypeOfNullError extends React.Component {
          handleClick() {}
          foo;
          render() {
            let a;
            return <button disabled onClick={this.handleClick} foo={this.foo}>Text</button>;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Foo extends React.Component {
          handleClick() {}
          render() {
            return <button onClick={this.handleClick}>Text</button>;
          }
        }
      `,
    },
    {
      code: `
        class Foo extends React.Component {
          action() {}
          componentDidMount() {
            this.action();
          }
          render() {
            return null;
          }
        }
      `,
    },
    {
      code: `
        class Foo extends React.Component {
          action() {}
          componentDidMount() {
            const action = this.action;
            action();
          }
          render() {
            return null;
          }
        }
      `,
    },
    {
      code: `
        class Foo extends React.Component {
          getValue() {}
          componentDidMount() {
            const action = this.getValue();
          }
          render() {
            return null;
          }
        }
      `,
    },
    {
      code: `
        class Foo extends React.Component {
          handleClick = () => {}
          render() {
            return <button onClick={this.handleClick}>Button</button>;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Foo extends React.Component {
          renderContent() {}
          render() {
            return <div>{this.renderContent()}</div>;
          }
        }
      `,
    },
    {
      code: `
        class Foo extends React.Component {
          renderContent() {}
          render() {
            return (
              <div>
                <div>{this.renderContent()}</div>;
              </div>
            );
          }
        }
      `,
    },
    {
      code: `
        class Foo extends React.Component {
          property = {}
          render() {
            return <div property={this.property}>Example</div>;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Foo extends React.Component {
          action = () => {}
          anotherAction = () => {
            this.action();
          }
          render() {
            return <button onClick={this.anotherAction}>Example</button>;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Foo extends React.Component {
          action = () => {}
          anotherAction = () => this.action()
          render() {
            return <button onClick={this.anotherAction}>Example</button>;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Foo extends React.Component {
          getValue = () => {}
          value = this.getValue()
          render() {
            return this.value;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Foo {
          action = () => {}
          anotherAction = () => this.action()
        }
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Foo extends React.Component {
          action = async () => {}
          render() {
            return <button onClick={this.action}>Click</button>;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Foo extends React.Component {
          async action() {
            console.log('error');
          }
          render() {
            return <button onClick={() => this.action()}>Click</button>;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Foo extends React.Component {
          * action() {
            console.log('error');
          }
          render() {
            return <button onClick={() => this.action()}>Click</button>;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Foo extends React.Component {
          async * action() {
            console.log('error');
          }
          render() {
            return <button onClick={() => this.action()}>Click</button>;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Foo extends React.Component {
          action = function() {
            console.log('error');
          }
          render() {
            return <button onClick={() => this.action()}>Click</button>;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
    },
    `class ClassAssignPropertyInMethodTest extends React.Component {
      constructor() {
        this.foo = 3;;
      }
      render() {
        return <SomeComponent foo={this.foo} />;
      }
    }`,
    {
      code: `class ClassPropertyTest extends React.Component {
          foo;
          render() {
            return <SomeComponent foo={this.foo} />;
          }
        }`,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `class ClassPropertyTest extends React.Component {
          foo = a;
          render() {
            return <SomeComponent foo={this.foo} />;
          }
        }`,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `class Foo extends React.Component {
          ['foo'] = a;
          render() {
            return <SomeComponent foo={this['foo']} />;
          }
        }`,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `class Foo extends React.Component {
          ['foo'];
          render() {
            return <SomeComponent foo={this['foo']} />;
          }
        }`,
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `class ClassComputedTemplatePropertyTest extends React.Component {
          [\`foo\`] = a;
          render() {
            return <SomeComponent foo={this[\`foo\`]} />;
          }
        }`,
      parser: parsers.BABEL_ESLINT,
    },
    `class ClassLiteralComputedMemberTest extends React.Component {
      ['foo']() {}
      render() {
        return <SomeComponent foo={this.foo} />;
      }
    }`,
    `class ClassComputedTemplateMemberTest extends React.Component {
      [\`foo\`]() {}
      render() {
        return <SomeComponent foo={this.foo} />;
      }
    }`,
    `class ClassUseAssignTest extends React.Component {
      foo() {}
      render() {
        this.foo;
        return <SomeComponent />;
      }
    }`,
    `class ClassUseAssignTest extends React.Component {
      foo() {}
      render() {
        const { foo } = this;
        return <SomeComponent />;
      }
    }`,
    `class ClassUseDestructuringTest extends React.Component {
      foo() {}
      render() {
        const { foo } = this;
        return <SomeComponent />;
      }
    }`,
    `class ClassUseDestructuringTest extends React.Component {
      ['foo']() {}
      render() {
        const { 'foo': bar } = this;
        return <SomeComponent />;
      }
    }`,
    `class ClassComputedMemberTest extends React.Component {
      [foo]() {}
      render() {
        return <SomeComponent />;
      }
    }`,
    `class ClassWithLifecyleTest extends React.Component {
      constructor(props) {
        super(props);
      }
      static getDerivedStateFromProps() {}
      componentWillMount() {}
      UNSAFE_componentWillMount() {}
      componentDidMount() {}
      componentWillReceiveProps() {}
      UNSAFE_componentWillReceiveProps() {}
      shouldComponentUpdate() {}
      componentWillUpdate() {}
      UNSAFE_componentWillUpdate() {}
      static getSnapshotBeforeUpdate() {}
      componentDidUpdate() {}
      componentDidCatch() {}
      componentWillUnmount() {}
      render() {
        return <SomeComponent />;
      }
    }`,
  ],

  invalid: [
    {
      code: `
        class Foo extends React.Component {
          property = {}
          render() {
            return <div>Example</div>;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Unused method or property "property" of class "Foo"',
        line: 3,
        column: 11,
      }],
    },
    {
      code: `
        class Foo extends React.Component {
          handleClick() {}
          render() {
            return null;
          }
        }
      `,
      errors: [{
        message: 'Unused method or property "handleClick" of class "Foo"',
        line: 3,
        column: 11,
      }],
    },
    {
      code: `
        class Foo extends React.Component {
          handleScroll() {}
          handleClick() {}
          render() {
            return null;
          }
        }
      `,
      errors: [{
        message: 'Unused method or property "handleScroll" of class "Foo"',
        line: 3,
        column: 11,
      }, {
        message: 'Unused method or property "handleClick" of class "Foo"',
        line: 4,
        column: 11,
      }],
    },
    {
      code: `
        class Foo extends React.Component {
          handleClick = () => {}
          render() {
            return null;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Unused method or property "handleClick" of class "Foo"',
        line: 3,
        column: 11,
      }],
    },
    {
      code: `
        class Foo extends React.Component {
          action = async () => {}
          render() {
            return null;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Unused method or property "action" of class "Foo"',
        line: 3,
        column: 11,
      }],
    },
    {
      code: `
        class Foo extends React.Component {
          async action() {
            console.log('error');
          }
          render() {
            return null;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Unused method or property "action" of class "Foo"',
        line: 3,
        column: 17,
      }],
    },
    {
      code: `
        class Foo extends React.Component {
          * action() {
            console.log('error');
          }
          render() {
            return null;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Unused method or property "action" of class "Foo"',
        line: 3,
        column: 13,
      }],
    },
    {
      code: `
        class Foo extends React.Component {
          async * action() {
            console.log('error');
          }
          render() {
            return null;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Unused method or property "action" of class "Foo"',
        line: 3,
        column: 19,
      }],
    },
    {
      code: `
        class Foo extends React.Component {
          action = function() {
            console.log('error');
          }
          render() {
            return null;
          }
        }
      `,
      parser: parsers.BABEL_ESLINT,
      errors: [{
        message: 'Unused method or property "action" of class "Foo"',
        line: 3,
        column: 11,
      }],
    },
    {
      code: `
        class ClassAssignPropertyInMethodTest extends React.Component {
          constructor() {
            this.foo = 3;
          }
          render() {
            return <SomeComponent />;
          }
        }
      `,
      errors: [{
        message: 'Unused method or property "foo" of class "ClassAssignPropertyInMethodTest"',
        line: 4,
        column: 18,
      }],
    },
    {
      code: `
        class Foo extends React.Component {
          foo;
          render() {
            return <SomeComponent />;
          }
        }
      `,
      errors: [{
        message: 'Unused method or property "foo" of class "Foo"',
        line: 3,
        column: 11,
      }],
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Foo extends React.Component {
          foo = a;
          render() {
            return <SomeComponent />;
          }
        }
      `,
      errors: [{
        message: 'Unused method or property "foo" of class "Foo"',
        line: 3,
        column: 11,
      }],
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Foo extends React.Component {
          ['foo'];
          render() {
            return <SomeComponent />;
          }
        }
      `,
      errors: [{
        message: 'Unused method or property "foo" of class "Foo"',
        line: 3,
        column: 12,
      }],
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Foo extends React.Component {
          ['foo'] = a;
          render() {
            return <SomeComponent />;
          }
        }
      `,
      errors: [{
        message: 'Unused method or property "foo" of class "Foo"',
        line: 3,
        column: 12,
      }],
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Foo extends React.Component {
          foo = a;
          render() {
            return <SomeComponent foo={this[foo]} />;
          }
        }
      `,
      errors: [{
        message: 'Unused method or property "foo" of class "Foo"',
        line: 3,
        column: 11,
      }],
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: `
        class Foo extends React.Component {
          private foo;
          render() {
            return <SomeComponent />;
          }
        }
      `,
      errors: [{
        message: 'Unused method or property "foo" of class "Foo"',
        line: 3,
        column: 19,
      }],
      parser: parsers.TYPESCRIPT_ESLINT,
    },
    {
      code: `
        class Foo extends React.Component {
          private foo() {}
          render() {
            return <SomeComponent />;
          }
        }
      `,
      errors: [{
        message: 'Unused method or property "foo" of class "Foo"',
        line: 3,
        column: 19,
      }],
      parser: parsers.TYPESCRIPT_ESLINT,
    },
    {
      code: `
        class Foo extends React.Component {
          private foo = 3;
          render() {
            return <SomeComponent />;
          }
        }
      `,
      errors: [{
        message: 'Unused method or property "foo" of class "Foo"',
        line: 3,
        column: 19,
      }],
      parser: parsers.TYPESCRIPT_ESLINT,
    },
  ],
});
