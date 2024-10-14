import jsEslintConfig from '@nish1896/eslint-flat-config/js';

export default [
  ...jsEslintConfig,
  {
    ignores: ['node_modules', 'build', 'dist']
  },
  {
    files: ['src/**/*{.js,.jsx,.ts,.tsx}'],
    rules: {}
  }
];
