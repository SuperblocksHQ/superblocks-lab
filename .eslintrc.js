module.exports = {
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "commonjs": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 6,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "off",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "off",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": "warn",
        "no-unused-vars": "warn",
        "no-unexpected-multiline": "warn",
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error"
    }
};
