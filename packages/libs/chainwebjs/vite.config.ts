import { defineLibConfig } from '@kda-community-dev/vite-config/lib';
import { defineBaseTestConfig } from '@kda-community-dev/vitest-config/base';
import { mergeConfig, type UserConfig } from 'vite';

export default mergeConfig(
  mergeConfig(defineLibConfig(), defineBaseTestConfig()),
  {
    test: {
      coverage: {
        thresholds: {
          lines: 86.31,
          functions: 80,
          branches: 87.5,
          statements: 86.31,
        },
      },
    },
  } as UserConfig,
);
