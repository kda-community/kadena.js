import { defineLibConfig } from '@kda-community-dev/vite-config/lib';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  defineLibConfig(),
  defineConfig({
    test: {
      coverage: {
        provider: 'v8',
        thresholds: {
          lines: 86.31,
          functions: 80,
          branches: 87.5,
          statements: 86.31,
        },
      },
    },
  }),
);
