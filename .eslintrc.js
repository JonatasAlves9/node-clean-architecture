module.exports = {

  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      extends: 'standard-with-typescript',
      rules: {
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/return-await": "off"
      },
    },
  ],

  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },

}
