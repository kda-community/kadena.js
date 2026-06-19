import { dump, load } from 'js-yaml';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Generate labels in `.github/labeler.yml`
// Usage: `npx tsx packages/tools/scripts/generate-labels.ts`

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseDir = join(__dirname, '../../..');

const packageJsonPath = `${baseDir}/packages.json`;
const labelerYmlPath = `${baseDir}/.github/labeler.yml`;

const main = async () => {
  // Read the package.json file
  const packages = JSON.parse(await readFile(packageJsonPath, 'utf8'));
  const existingLabels = load(await readFile(labelerYmlPath, 'utf8')) || {};

  for (const pkg of packages) {
    const packageName = pkg.name;
    const packagePath = pkg.path;

    // Check if the package is already present in the labels
    if (!existingLabels[packageName]) {
      const options = {
        [packageName]: [
          {
            'changed-files': [
              {
                'any-glob-to-any-file': `${packagePath}/*`,
              },
            ],
          },
        ],
      };
      existingLabels[packageName] = options[packageName];
    }
  }

  const yamlString = dump(existingLabels);
  await writeFile(labelerYmlPath, yamlString, 'utf8');
};
main();
