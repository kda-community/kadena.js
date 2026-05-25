import { defineNodeConfig } from '@kda-community-dev/vite-config/node';
import { mergeConfig } from 'vite';

const config: Record<string, any> = mergeConfig(defineNodeConfig(), {});

config.build.lib.formats = ['es'];

export default config;
