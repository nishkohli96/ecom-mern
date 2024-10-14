import jsEslintConfig from '@nish1896/eslint-flat-config/js';
import jsxEslintConfig from '@nish1896/eslint-flat-config/jsx';

export default [
  ...jsEslintConfig,
  ...jsxEslintConfig,
  {
    files: ['src/**/*{.js,.jsx,.ts,.tsx}'],
    rules: {},
    ignores: [
			'node_modules',
			'dist/**/*{.js,.d.ts}'
		]
  }
];
