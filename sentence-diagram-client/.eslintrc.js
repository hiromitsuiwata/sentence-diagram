module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "plugins": [
        "vue"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential",
        "prettier"
    ],
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
    }
};
