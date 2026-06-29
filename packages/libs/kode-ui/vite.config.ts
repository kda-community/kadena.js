import { defineReactConfig } from '@kda-community-dev/vite-config/react';
import { defineBaseTestConfig } from '@kda-community-dev/vitest-config/base';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { mergeConfig, type UserConfig } from 'vite';

export default mergeConfig(
  mergeConfig(defineReactConfig(), defineBaseTestConfig()),
  {
    plugins: [vanillaExtractPlugin()],
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
    test: {
      setupFiles: ['vitest.setup.ts'],
      environment: 'happy-dom',
      globals: true,
      coverage: {
        include: ['**/src/**.{test,spec}.{ts,tsx}'],
        exclude: [
          '**/{Icon,entries,styles,storyDecorators}/**',
          '**/*.css.ts',
          '**/*.stories.*',
        ],
        thresholds: {
          lines: 30.0,
          functions: 20.0,
          branches: 60.0,
          statements: 30.0,
        },
      },
    },
  } as UserConfig,
);
