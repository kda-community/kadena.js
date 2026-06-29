import { defineLibConfig } from '@kda-community-dev/vite-config/lib';
import { defineBaseTestConfig } from '@kda-community-dev/vitest-config/base';
import { mergeConfig, type UserConfig } from 'vite';

export default mergeConfig(
  mergeConfig(defineLibConfig(), defineBaseTestConfig()),
  {
    test: {
      coverage: {
        thresholds: {
          lines: 97,
          functions: 100,
          branches: 81,
          statements: 97,
        },
      },
    },
  } as UserConfig,
);
