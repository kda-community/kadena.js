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
          'built-in/index': './src/built-in/index.ts',
          'coin/index': './src/coin/index.ts',
          'core/index': './src/core/index.ts',
          'nodejs/index': './src/nodejs/index.ts',
          'marmalade/index': './src/marmalade/index.ts',
          'webauthn/index': './src/webauthn/index.ts',
          'faucet/index': './src/faucet/index.ts',
        },
      },
    },
    test: {
      exclude: ['src/**/*.int.test.ts', 'src/interfaces/async-pipe-type.ts'],
      coverage: {
        exclude: [
          // we have integration for this
          'src/coin/**/*',
          // we have integration for this
          'src/built-in/**/*',
          // we have integration for this
          'src/core/estimate-gas.ts',
          // we have integration for this
          'src/marmalade/**/*',
          // this service interacts with github
          'src/nodejs/services/download-git-files.ts',
          // its just type
          'src/interfaces/async-pipe-type.ts',
          // its just type and I have a test for that
          'src/core/utils/types.ts',
          // its a script that generates the asyncPipe type
          'src/scripts/**/*',
          // its a script and auxiliary files that deploys marmalade namespaces and contracts
          'src/nodejs/marmalade/deployment/**/*',
          // we have integration for this
          'src/core/estimateGasPrice/estimateGasPrice.ts',
          'src/webauthn/**/*',
        ],
        thresholds: {
          lines: 90,
          functions: 90,
          branches: 90,
          statements: 90,
        },
      },
    },
  } as UserConfig,
);
