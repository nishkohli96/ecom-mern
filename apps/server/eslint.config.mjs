import jsEslintConfig from '@nish1896/eslint-flat-config/js';

export default [
  ...jsEslintConfig,
  {
    files: ['src/**/*{.js,.jsx,.ts,.tsx}'],
    rules: {}
  }
];
