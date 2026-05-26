import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type UserConfig } from 'vite';
import dts from 'vite-plugin-dts';

export function defineReactConfig(): UserConfig {
  const packageJsonPath: string = resolve(process.cwd(), 'package.json');
  const packageJson: Record<string, any> = JSON.parse(
    readFileSync(packageJsonPath, 'utf-8'),
  );

  const { dependencies } = packageJson;

  const monorepoPackages: string[] = Object.keys(dependencies).filter(
    (key: string) => dependencies[key].startsWith('workspace:'),
  );

  return defineConfig({
    plugins: [
      react(),
      vanillaExtractPlugin(),
      dts({
        include: ['src'],
        outDirs: ['dist'],
        bundleTypes: false,
      }),
    ],
    optimizeDeps: {
      include: [...monorepoPackages],
    },
    build: {
      rolldownOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
    },
  });
}
