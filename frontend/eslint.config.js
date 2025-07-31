//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    ignores: ['eslint.config.js', 'prettier.config.js'],
  },
  {
    rules: {
      // Disable pnpm catalog enforcement
      'pnpm/json-enforce-catalog': 'off',
    },
  },
]
