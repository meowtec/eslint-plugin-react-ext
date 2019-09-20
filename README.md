# eslint-plugin-react-ext

The missing rules for [eslint-react-plugin](https://github.com/yannickcr/eslint-plugin-react).

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-react` and `eslint-plugin-react-ext`:

```
$ npm install eslint-plugin-react eslint-plugin-react-ext --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-react` and `eslint-plugin-react-ext` globally.

## Usage

Add `eslint-plugin-react-ext` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "react-ext"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "react-ext/no-unused-class-property": 2
    }
}
```

## Supported Rules

* `no-unused-class-property` Prevent declaring unused methods of class component.
