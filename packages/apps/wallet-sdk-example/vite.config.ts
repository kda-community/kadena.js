import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import path from 'path';
import { defineConfig, UserConfig } from 'vite';

/**
 * Get list of monorepo packages from package.json non-dev-dependencies
 * @returns {string[]} - list of package names
 */
function getMonorepoPackagesFromPackageJson() {
  const packageJson = fs.readFileSync(
    path.resolve(__dirname, './package.json'),
    'utf-8',
  );
  const { dependencies } = JSON.parse(packageJson);
  const packages = Object.keys(dependencies).filter((key) =>
    dependencies[key].startsWith('workspace:'),
  );

  return packages;
}

const monorepoPackages = getMonorepoPackagesFromPackageJson();

monorepoPackages.push('@kda-community/client-utils');
monorepoPackages.push('@kda-community/cryptography-utils');
monorepoPackages.push('@kda-community/pactjs');
monorepoPackages.push('@kda-community/wallet-sdk');

const monorepoPathsRegex = monorepoPackages.map(
  (pkg) => new RegExp(`${pkg.replace('@kda-community/', '')}`),
);
monorepoPackages.push('@kda-community/client/fp');

export const config: UserConfig = {
  plugins: [vanillaExtractPlugin(), react()],
  optimizeDeps: {
    // add all monorepo packages to optimizeDeps since they are commonjs
    include: [...monorepoPackages],
  },
  build: {
    commonjsOptions: {
      // add all monorepo packages path regex to commonjsOptions since they are commonjs
      include: [/node_modules/, ...monorepoPathsRegex],
    },
  },
};

export default defineConfig(config);
