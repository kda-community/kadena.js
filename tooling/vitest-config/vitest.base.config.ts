import { defineConfig, type ViteUserConfig } from 'vitest/config';

export function defineBaseTestConfig(): ViteUserConfig {
  return defineConfig({
    test: {
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      globals: false,
      coverage: {
        include: ['src/**'],
        exclude: ['**/tests/**', '**/integration-tests/**', '**/test/**'],
        enabled: true,
        provider: 'v8',
      },
    },
  });
}
