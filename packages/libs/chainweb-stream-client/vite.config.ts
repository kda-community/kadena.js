import { defineLibConfig } from '@kda-community-dev/vite-config/lib';
import { defineBaseTestConfig } from '@kda-community-dev/vitest-config/base';
import { mergeConfig, type UserConfig } from 'vite';

export default mergeConfig(
  mergeConfig(defineLibConfig(), defineBaseTestConfig()),
  {
    test: {
      coverage: {
        thresholds: {
          lines: 16.29,
          functions: 40,
          branches: 68.57,
          statements: 16.29,
        },
      },
    },
  } as UserConfig,
);
