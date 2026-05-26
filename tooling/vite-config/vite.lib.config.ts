import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type UserConfig } from 'vite';
import dts from 'vite-plugin-dts';

export function defineLibConfig(): UserConfig {
  const packageJsonPath: string = resolve(process.cwd(), 'package.json');
  const packageJson: Record<string, any> = JSON.parse(
    readFileSync(packageJsonPath, 'utf-8'),
  );

  const hasPactCli =
    packageJson.devDependencies &&
    Object.keys(packageJson.devDependencies).some((dep) =>
      dep.startsWith('@kadena/pactjs-cli'),
    );

  const typeIncludes: string[] = ['src'];
  if (hasPactCli) {
    typeIncludes.push(
      'node_modules/.kadena/**/*.d.ts',
      '../../node_modules/.kadena/**/*.d.ts',
    );
  }

  return defineConfig({
    publicDir: false,
    plugins: [
      dts({
        include: typeIncludes,
        outDirs: ['dist'],
      }),
    ],
    resolve: {
      alias: {
        'node:buffer': 'buffer',
      },
    },
    build: {
      lib: {
        entry: './src/index.ts',
        name: packageJson.name.replace(/[^a-zA-Z0-9_]/g, ''),
        fileName: (format, entryName): string =>
          `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
        formats: ['es', 'cjs'],
      },
      emptyOutDir: true,
      sourcemap: false,
    },
  });
}
