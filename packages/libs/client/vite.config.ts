import { defineLibConfig } from '@kda-community-dev/vite-config/lib';
import { mergeConfig } from 'vite';

export default mergeConfig(defineLibConfig(), {
  build: {
    lib: {
      entry: {
        index: './src/index.ts',
        fp: './src/fp.ts',
      },
    },
  },
});
