import jsEslintConfig from '@nish1896/eslint-flat-config/js';
import jsxEslintConfig from '@nish1896/eslint-flat-config/jsx';

export default [
  ...jsEslintConfig,
  ...jsxEslintConfig, /* for react/nextjs/vite apps */
  {
    files: ['src/**/*{.js,.jsx,.ts,.tsx}'],
    rules: {}
  }
];
