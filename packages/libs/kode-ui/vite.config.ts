import { defineReactConfig } from '@kda-community-dev/vite-config/react';
import { mergeConfig, type UserConfig } from 'vite';

export default mergeConfig(defineReactConfig(), {
  build: {
    lib: {
      entry: {
        index: './src/index.ts',
        styles: './src/styles/index.ts',
        global: './src/entries/global.ts',
      },
      fileName: (format: string, entryName: string) =>
        `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
      formats: ['es'],
    },
    rolldownOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: (assetInfo) => {
          if (
            assetInfo.names.some((name: string): boolean =>
              name.endsWith('.css'),
            )
          ) {
            return '[name][extname]';
          }

          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
} as UserConfig);
