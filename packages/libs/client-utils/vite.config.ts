import { defineLibConfig } from '@kda-community-dev/vite-config/lib';
import { mergeConfig } from 'vite';

export default mergeConfig(defineLibConfig(), {
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
});
