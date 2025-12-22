const parser = require('@typescript-eslint/parser');
const tseslint = require('@typescript-eslint/eslint-plugin');

module.exports = [
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: parser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
        },
        rules: {
            'no-console': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
];
