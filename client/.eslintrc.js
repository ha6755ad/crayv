module.exports = {
  'env': {
    'es6': true,
    'node': true,
    'mocha': true
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'parser': 'babel-eslint'
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  'rules': {
    // "indent": [2, 2, {"VariableDeclarator": "first", "SwitchCase": 1}],
    'vue/script-indent': [2, 2, {'baseIndent': 1, 'switchCase': 1, 'ignores': []}],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ]
  },
  'overrides': [
    {
      'files': [
        '**/__tests__/*.{j,t}s?(x)'
      ],
      'env': {
        'mocha': true
      }
    }
  ],
  'globals': { '_': true },
};
