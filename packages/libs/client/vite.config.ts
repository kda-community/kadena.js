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
          fp: './src/fp.ts',
        },
      },
    },
    test: {
      exclude: ['src/**/*.int.test.ts'],
      coverage: {
        exclude: [
          // Type only files
          'src/client/interfaces/interfaces.ts',
          'src/interfaces/IPactCommand.ts',
          'src/interfaces/ISigningRequest.ts',
          'src/interfaces/type-utilities.ts',
          'src/signing/eckoWallet/eckoTypes.ts',
        ],
        thresholds: {
          lines: 99,
          functions: 92,
          branches: 96,
          statements: 99,
        },
      },
    },
  } as UserConfig,
);
