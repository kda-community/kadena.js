// @ts-check

/** @type {import("syncpack").RcFile} */
const config = {
  versionGroups: [
    {
      label: 'Internal packages that have inconsistent version usage',
      packages: ['**'],
      dependencies: [
        '@kda-community/chainweb-node-client',
        '@kda-community/client',
        '@kda-community/fonts',
        '@kda-community/pactjs-cli',
        '@kda-community-dev/eslint-plugin',
        '@kda-community/spirekey-sdk',
        'remark-gfm',
        'hw-app-kda-clone',
      ],
      isIgnored: true, // Toggle flag or or remove group to see inconsistencies
    },
    {
      label: 'Internal dev packages are pinned to `workspace:*`',
      packages: ['**'],
      dependencies: [
        '@kda-community-dev/*',
        '@kda-community/types',
        '@kda-community/kode-icons',
      ],
      dependencyTypes: ['dev'],
      pinVersion: 'workspace:*',
    },
    {
      label: 'Internal packages are pinned to `workspace:*`',
      packages: ['**'],
      dependencies: ['@kda-community/*'],
      dependencyTypes: ['prod', 'dev'],
      pinVersion: 'workspace:*',
    },
    {
      label:
        'Types and internal dev packages are banned from dependencies (only allowed in devDependencies)',
      packages: ['**'],
      dependencies: ['@types/*', '*/types', '@kda-community-dev/*'],
      dependencyTypes: ['prod'],
      isBanned: true,
    },
    {
      label:
        'Allow `@kda-community/tools` to downgrade `@vanilla-extract/next-plugin` to fix initial render issues (see https://github.com/vanilla-extract-css/vanilla-extract/issues/1152#issuecomment-1784531987)',
      packages: ['@kda-community/tools'],
      dependencies: ['@vanilla-extract/next-plugin'],
    },
    {
      label: 'Allow buffer to have two versions',
      packages: ['@kda-community/js-monorepo'],
      dependencies: ['buffer'],
    },
  ],
};

module.exports = config;
