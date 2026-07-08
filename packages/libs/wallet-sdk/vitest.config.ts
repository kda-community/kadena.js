import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    exclude: ['src/**/*.int.test.ts'],
    coverage: {
      exclude: ['src/gql/*.ts'],
      provider: 'v8',
      thresholds: {
        lines: 65,
        functions: 65,
        branches: 65,
        statements: 65,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
