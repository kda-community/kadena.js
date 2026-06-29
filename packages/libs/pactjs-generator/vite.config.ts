import { defineNodeConfig } from '@kda-community-dev/vite-config/node';
import { defineBaseTestConfig } from '@kda-community-dev/vitest-config/base';
import { mergeConfig } from 'vite';

export default mergeConfig(defineNodeConfig(), defineBaseTestConfig());
