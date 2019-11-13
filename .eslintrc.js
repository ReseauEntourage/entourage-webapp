module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  extends: ['airbnb', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    // TypeScript Rules
    '@typescript-eslint/no-unused-vars': [1, { ignoreRestSiblings: true }],
    '@typescript-eslint/member-delimiter-style': [1, {
      "multiline": {
        "delimiter": "semi",
        "requireLast": true
      },
      "singleline": {
        "delimiter": "semi",
        "requireLast": true
      },
    }],

    // Import Rules
    'import/no-default-export': 2,
    'import/prefer-default-export': 0,

    // Accessibility Rules
    // disable anchor-is-valid due to NextJS <a> wrapper
    'jsx-a11y/anchor-is-valid': 0,

    // React Rules
    'react/jsx-filename-extension': 0,
    'react/jsx-boolean-value': [1, 'always'],
    'react/jsx-one-expression-per-line': 0,
    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': 2,

    // Plain JavaScript Rules
    'no-console': [1, { allow: ['warn', 'error'] }],
    'semi': [1, 'never'],
  },
  'overrides': [
    {
      // storybook use both default export and named exports
      'files': ['src/**/*.stories.tsx'],
      'rules': {
        'import/no-default-export': 0,
      }
    }
  ],
  settings: {
    'import/resolver': {
      // use <root>/tsconfig.json
      typescript: {},
    },
  },
}
