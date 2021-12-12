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
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-expect-error": "allow-with-description",
        "ts-ignore": true,
        "ts-nocheck": true,
        "ts-check": true,
        "minimumDescriptionLength": 3
      }
    ],
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/interface-name-prefix': 0,

    // Import Rules
    'import/extensions': [2, 'always', { 'ts': 'never', 'tsx': 'never', 'js': 'never' }],
    'import/no-default-export': 2,
    'import/prefer-default-export': 0,
    // allow to use devDeps in test files.
    // See options: https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md#options
    'import/no-extraneous-dependencies': ["error", {"devDependencies": ["**/*.spec.ts"]}],
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
     // with TypeScript, no default props
    'react/require-default-props': 0,

    // Plain JavaScript Rules
    'arrow-body-style': 0,
    'max-len': [1, { code: 120 }],
    'no-console': [1, { allow: ['warn', 'error'] }],
    'no-multiple-empty-lines': [2, { "max": 1 }], // prettier like
    'no-restricted-imports': ['error', {
      'patterns': [
        'src/*/*',
        '!src/adapters/**/*',
        '!src/components/*',
        'src/components/*/*',
        '!src/constants',
        'src/constants/*',
        '!src/containers/*',
        'src/containers/*/*',
        '!src/core/*',
        'src/core/*/*',
        '!src/core/useCases/*',
        'src/core/useCases/*/*',
        '!src/core/utils/*',
        '!src/hooks/*',
        '!src/i18n',
        'src/i18n/*',
        '!src/styles',
        'src/styles/*',
        '!src/utils/*',
        'src/utils/*/*',
      ]
    }],
    'semi': [1, 'never'],
    // max-len is enought
    'object-curly-newline': 0,
    // disable due to TypeScript params. More infos here: https://kendaleiv.com/typescript-constructor-assignment-public-and-private-keywords
    'no-useless-constructor': 0,
    'class-methods-use-this': 0,
    'max-classes-per-file': 0,

    // Override after dependencies upgrade. To Fix
    'react/function-component-definition': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'no-shadow': 0,
    'no-use-before-define': 0,
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
        'no-restricted-exports': 0,
      }
    },
    {
      'files': ['src/**/*.reducer.ts'],
      'rules': {
        'default-param-last': 0,
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
