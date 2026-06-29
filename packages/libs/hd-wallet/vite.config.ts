import { defineLibConfig } from '@kda-community-dev/vite-config/lib';
import { defineBaseTestConfig } from '@kda-community-dev/vitest-config/base';
import { mergeConfig, type UserConfig } from 'vite';

export default mergeConfig(
  mergeConfig(defineLibConfig(), defineBaseTestConfig()),
  {
    build: {
      lib: {
        entry: {
          index: './src/index.ts',
          'chainweaver/index': './src/chainweaver/index.ts',
        },
      },
    },
    test: {
      testTimeout: 30000,
    },
  } as UserConfig,
);
