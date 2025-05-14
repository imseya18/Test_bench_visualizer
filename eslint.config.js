import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintPluginUnicorn.configs.recommended,
  {
    files: ['**/*.{jsx,tsx,js,ts}'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
]);
