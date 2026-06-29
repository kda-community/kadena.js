import { defineReactConfig } from '@kda-community-dev/vite-config/react';
import { defineBaseTestConfig } from '@kda-community-dev/vitest-config/base';
import { mergeConfig, type UserConfig } from 'vite';

export default mergeConfig(
  mergeConfig(defineReactConfig(), defineBaseTestConfig()),
  {
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
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['src/__tests__/**/*.{test,spec}.{ts,tsx}'],
    },
  } as UserConfig,
);
