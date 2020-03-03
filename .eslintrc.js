module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },

  env: {
    browser: true
  },

  extends: [
    'standard',
    // @see https://vuejs.org/v2/style-guide and https://eslint.vuejs.org/rules
    // 'plugin:vue/essential' // Error Prevention
    // 'plugin:vue/strongly-recommended' // Improving Readability
    'plugin:vue/recommended' // Minimizing Arbitrary Choices and Cognitive Overhead
  ],

  plugins: [
    // for *.vue files
    'vue'
  ],

  globals: {
    'process': true
  },

  // custom rules
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    'one-var': 'off',

    'import/first': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'prefer-promise-reject-errors': 'off',

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    // temporary fix for eslint error
    // https://github.com/babel/babel-eslint/issues/799#issuecomment-568195009
    "indent": [
      "error",
      2,
      {
        "ignoredNodes": [
          "TemplateLiteral"
        ]
      }
    ],
    "template-curly-spacing": [
      "off"
    ]
  }
}
