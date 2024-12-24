/** @type {import("eslint").Linter.Config} */
const config = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": true
  },
  "plugins": [
    "@typescript-eslint",
    "drizzle"
  ],
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked"
  ],
  "rules": {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": {
          "attributes": false
        }
      }
    ],
    "drizzle/enforce-delete-with-where": [
      "error",
      {
        "drizzleObjectName": [
          "db",
          "ctx.db"
        ]
      }
    ],
    "drizzle/enforce-update-with-where": [
      "error",
      {
        "drizzleObjectName": [
          "db",
          "ctx.db"
        ]
      }
    ],
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/prefer-optional-chain": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/non-nullable-type-assertion-style": "off",
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/no-confusing-non-null-assertion": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "off",
    "@next/next/no-img-element": "off"
  }
}
module.exports = config;