import type { SnapConfig } from '@metamask/snaps-cli';
import { resolve } from 'path';
import { NormalModuleReplacementPlugin } from 'webpack';

const config: SnapConfig = {
  bundler: 'webpack',
  input: resolve(__dirname, 'src/index.ts'),
  server: {
    port: 8080,
  },
  polyfills: {
    crypto: true,
    buffer: true,
  },
  customizeWebpackConfig: (webpackConfig) => {
    webpackConfig.plugins = [
      ...(webpackConfig.plugins || []),
      new NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, '');
      }),
    ];
    return webpackConfig;
  },
};

export default config;
