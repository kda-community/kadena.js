import { defineNodeConfig } from '@kda-community-dev/vite-config/node';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';

export default mergeConfig(defineNodeConfig(), {
  resolve: {
    alias: {
      '@db': fileURLToPath(new URL('./src/db', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@devnet': fileURLToPath(new URL('./src/devnet', import.meta.url)),
    },
  },
});
