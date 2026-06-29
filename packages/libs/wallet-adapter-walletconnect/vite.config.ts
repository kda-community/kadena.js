import { defineLibConfig } from '@kda-community-dev/vite-config/lib';
import { defineBaseTestConfig } from '@kda-community-dev/vitest-config/base';
import { mergeConfig, type UserConfig } from 'vite';

export default mergeConfig(
  mergeConfig(defineLibConfig(), defineBaseTestConfig()),
  {
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['src/__tests__/**/*.{test,spec}.{ts,tsx}'],
      setupFiles: ['./setupVitest.mjs'],
    },
  } as UserConfig,
);
