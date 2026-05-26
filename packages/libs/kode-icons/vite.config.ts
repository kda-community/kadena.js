import { defineReactConfig } from '@kda-community-dev/vite-config/react';
import { mergeConfig } from 'vite';

export default mergeConfig(defineReactConfig(), {
  build: {
    lib: {
      entry: {
        'brand/index': './src/brand/index.ts',
        'product/index': './src/product/index.ts',
        'system/index': './src/system/index.ts',
      },
      formats: ['es', 'cjs'],
      fileName: (format: string, entryName: string): string =>
        `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
  },
});
