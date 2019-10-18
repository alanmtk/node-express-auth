module.exports = {
    env: {
        commonjs: true,
        es6: true,
        node: true,
        jest: true
    },
    extends: [
        'airbnb-base',
        'plugin:prettier/recommended'
    ],
    rules: {
        "no-console": "off",
        'prettier/prettier': [
            'error',
            {
                'singleQuote': true,
                'parser': 'flow',
                'tabWidth': 4,
                'printWidth': 100
            }
        ]
    },
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018,
    },
};
