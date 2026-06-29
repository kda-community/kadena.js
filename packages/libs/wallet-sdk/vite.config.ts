import { defineLibConfig } from '@kda-community-dev/vite-config/lib';
import { defineBaseTestConfig } from '@kda-community-dev/vitest-config/base';
import { mergeConfig, type UserConfig } from 'vite';

export default mergeConfig(
  mergeConfig(defineLibConfig(), defineBaseTestConfig()),
  {
    test: {
      exclude: ['src/**/*.int.test.ts'],
      coverage: {
        exclude: ['src/gql/*.ts'],
        thresholds: {
          lines: 75,
          functions: 74,
          branches: 75,
          statements: 75,
        },
      },
    },
  } as UserConfig,
);
