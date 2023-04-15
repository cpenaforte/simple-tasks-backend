module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true,
  },
  'extends': [ 'eslint:recommended',
    'plugin:@typescript-eslint/recommended' ],
  'overrides': [],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
  },
  'plugins': ['@typescript-eslint'],
  'rules': {
    'indent': [ 'error', 2 ],
    'quotes': [ 'error', 'single' ],
    'semi': [ 2, 'always' ],
    'array-bracket-newline': [ 'error', { 'minItems': 3 } ],
    'array-bracket-spacing': [
      'error', 'always', { 'singleValue': false },
    ],
    'arrow-spacing': 'error',
    'block-spacing': 'error',
    'brace-style': 'error',
    'comma-dangle': [ 'error', 'always-multiline' ],
    'comma-spacing': [ 'error', {
      'before': false, 'after': true,
    } ],
    'comma-style': [ 'error', 'last' ],
    'computed-property-spacing': [ 'error', 'never' ],
    'key-spacing': [ 'error', { 'beforeColon': false } ],
    'keyword-spacing': [ 'error', { 'before': true } ],
    'max-statements-per-line': [ 'error', { 'max': 1 } ],
    'no-extra-parens': 'error',
    'no-multi-spaces': 'error',
    'no-multiple-empty-lines': [ 'error', {
      'max': 2, 'maxEOF': 0,
    } ],
    'no-trailing-spaces': 'error',
    'object-curly-newline': [ 'error', {
      'multiline': true, 'minProperties': 2, 'consistent': true,
    } ],
    'object-curly-spacing': [ 'error', 'always' ],
    'padded-blocks': [ 'error', 'never' ],
    'rest-spread-spacing': [ 'error', 'never' ],
    'space-before-blocks': 'error',
    'space-in-parens': [ 'error', 'never' ],
    'prefer-const': 'error',
    'prefer-destructuring': [
      'error', {
        'array': false,
        'object': true,
      }, { 'enforceForRenamedProperties': false },
    ],
    'curly': 'error',
    'arrow-body-style': [ 'error', 'as-needed' ],
  },
};
