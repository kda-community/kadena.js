import type { PackageJson } from '@npmcli/package-json';
import { join } from 'node:path';
import process from 'node:process';
import { loadJSON, loadJSONC, loadRules } from './helpers.js';
import { logger } from './logger.js';
import type { Rules, TSConfig } from './types.js';

const PACKAGE_DIR = process.cwd();
const PACKAGE_JSON = join(PACKAGE_DIR, 'package.json');
const TS_CONFIG = join(PACKAGE_DIR, 'tsconfig.json');

const main = async (): Promise<void> => {
  const pkgRules = await loadRules('package-json');
  const tsRules = await loadRules('typescript');

  const pkg = await loadJSON<PackageJson>(PACKAGE_JSON);
  const tsConfig = await loadJSONC<TSConfig>(TS_CONFIG);

  const options = {
    dir: PACKAGE_DIR,
    pkg,
    tsConfig,
  };

  const ruleSets: [Rules, string][] = [
    [pkgRules, 'package.json'],
    [tsRules, 'tsconfig.json'],
  ];

  ruleSets.forEach(([rules, file]) => {
    const log = logger(join(options.dir, file));
    rules
      .map((rule) => rule({ ...options, file }))
      .forEach((issues) => {
        log(issues);
        if (issues.some(([severity]) => severity === 'error')) {
          process.exitCode = 1;
        }
      });
  });
};

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
