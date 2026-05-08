<!-- genericHeader start -->

# @kda-community-dev/eslint-plugin

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

## Usage

```sh
pnpm add -D @kda-community-dev/eslint-plugin
```

Use to the ESLint config `plugins` and specify the issue severity. Example:

```js
/** @type {import("@types/eslint").Linter.Config} */
module.exports = {
  plugins: ['@kda-community-dev/eslint-plugin'],
  rules: {
    '@kda-community-dev/no-eslint-disable': 'error',
    '@kda-community-dev/typedef-var': 'warn',
  },
};
```
