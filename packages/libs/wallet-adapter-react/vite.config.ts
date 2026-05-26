import { defineReactConfig } from '@kda-community-dev/vite-config/react';
import { mergeConfig } from 'vite';

export default mergeConfig(defineReactConfig(), {
  build: {
    lib: {
      entry: {
        index: './src/index.ts',
      },
      formats: ['es'],
      fileName: (format: string, entryName: string): string =>
        `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
  },
});
