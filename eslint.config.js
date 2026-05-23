import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // قواعد عامة لكل JS / JSX
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'no-unused-vars': 'warn', // تحذير أصفر للمتغيرات غير المستخدمة
    },
  },
  // قواعد React
  {
    files: ['**/*.{js,jsx}'],
    plugins: { react: pluginReact },
    rules: {
      'react/react-in-jsx-scope': 'off', // لا حاجة لـ import React
    },
    settings: {
      react: { version: 'detect' }, // يتعرف تلقائيًا على نسخة React
    },
  },
]);
