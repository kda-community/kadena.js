// This file has been automatically migrated to valid ESM format by Storybook.
import { createRequire } from "node:module";
import type { StorybookConfig } from '@storybook/react-vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { dirname, join } from 'node:path';
import { mergeConfig } from 'vite';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: [
    '../src/Intro.mdx', // set as the first story
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],

  addons: [
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('storybook-dark-mode'),
    getAbsolutePath('@etchteam/storybook-addon-status'),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-docs")
  ],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  docs: {},

  viteFinal: async (config) => {
    return mergeConfig(config, {
      plugins: [vanillaExtractPlugin()],
      define: {
        global: 'globalThis',
      },
      optimizeDeps: {
        include: ['@kadena/kode-ui', '@kadena/kode-icons'],
      },
      build: {
        commonjsOptions: {
          include: [/node_modules/, /packages/],
          transformMixedEsModules: true,
        },
      },
    });
  },
};

export default config;

function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')));
}
