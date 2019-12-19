module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'typescript-sort-keys'],
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
    '@typescript-eslint/no-empty-interface': 0,
    // many times, typing will bring duplication
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/indent': ['error', 2],
    'typescript-sort-keys/interface': 1,
    'typescript-sort-keys/string-enum': 1,

    // Import Rules
    'import/extensions': [2, 'always', { 'ts': 'never', 'tsx': 'never', 'js': 'never' }],
    'import/no-default-export': 2,
    'import/prefer-default-export': 0,
    // 'sort-imports': 2,
    'import/order': [1, {
      'groups': ["builtin", "external", "internal", "parent", "sibling", "index"],
      'alphabetize': {
        order: 'asc'
      },
      "pathGroups": [
        {
          "pattern": "src/**",
          "group": "parent"
        },
      ]
    }],

    // Accessibility Rules
    // disable anchor-is-valid due to NextJS <a> wrapper
    'jsx-a11y/anchor-is-valid': 0,

    // React Rules
    'react/jsx-filename-extension': 0,
    'react/jsx-boolean-value': [1, 'always'],
    'react/jsx-one-expression-per-line': 0,
    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': 2,
    // with TypeScript strict mode, no issue
    'react/jsx-props-no-spreading': 0,
    'react/jsx-sort-props': 1,

    // Plain JavaScript Rules
    'arrow-body-style': 0,
    'max-len': [1, { code: 120 }],
    'no-console': [1, { allow: ['warn', 'error'] }],
    'no-multiple-empty-lines': [2, { "max": 1 }], // prettier like
    'no-restricted-imports': ['error', {
      'patterns': [
        'src/components/*/*',
        'src/constants/*',
        'src/containers/*/*',
        'src/core/*/*',
        'src/i18n/*',
        'src/pages',
        'src/styles/*',
        'src/utils/*/*',
      ]
    }],
    'semi': [1, 'never'],
    // max-len is enought
    'object-curly-newline': 0,
  },
  'overrides': [
    {
      // storybook use both default export and named exports
      'files': ['src/**/*.stories.tsx'],
      'rules': {
        'import/no-default-export': 0,
      }
    },
    {
      'files': ['src/pages/**'],
      'rules': {
        'import/no-default-export': 0,
        'import/prefer-default-export': 2,
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
