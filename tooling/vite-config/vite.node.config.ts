import { builtinModules } from 'module';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type UserConfig } from 'vite';

export function defineNodeConfig(): UserConfig {
  const packageJsonPath: string = resolve(process.cwd(), 'package.json');
  const packageJson: Record<string, any> = JSON.parse(
    readFileSync(packageJsonPath, 'utf-8'),
  );

  return defineConfig({
    publicDir: false,
    build: {
      minify: false,
      target: 'esnext',
      lib: {
        entry: 'src/index.ts',
        formats: ['cjs', 'es'],
        fileName: (format, entryName): string =>
          `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
      },

      rolldownOptions: {
        external: [
          ...builtinModules,
          ...builtinModules.map((m) => `node:${m}`),

          ...Object.keys(packageJson.dependencies || {}),
          ...Object.keys(packageJson.peerDependencies || {}),
        ],
      },
    },
  });
}
