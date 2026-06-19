import type { Changeset, Release, VersionType } from '@changesets/types';
import writeChangesetModule from '@changesets/write';
import { glob } from 'fast-glob';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const writeChangeset =
  typeof writeChangesetModule === 'function'
    ? writeChangesetModule
    : writeChangesetModule.default;

interface RushChange {
  packageName: string;
  comment: string;
  type: VersionType;
}

interface RushChangelog {
  changes: RushChange[];
}

const BUMP_LEVELS = ['none', 'patch', 'minor', 'major'] as const;

const __dirname: string = dirname(fileURLToPath(import.meta.url));
const baseDir: string = join(__dirname, '../../..');

const main = async (): Promise<void> => {
  const files: string[] = await glob('common/changes/**/*.json', {
    cwd: baseDir,
  });
  const filePaths: string[] = files.map((file: string): string =>
    join(baseDir, file),
  );

  const changelogs: RushChangelog[] = await Promise.all(
    filePaths.map(async (path: string): Promise<RushChangelog> => {
      const mod = await import(path);
      return (mod.default || mod) as RushChangelog;
    }),
  );

  const changesets: Changeset[] = changelogs.reduce(
    (acc: Changeset[], item: RushChangelog) => {
      item.changes.forEach((change: RushChange) => {
        let changeset: Changeset | undefined = acc.find(
          (c: Changeset): boolean => c.summary === change.comment,
        );

        if (!changeset) {
          changeset = {
            summary: change.comment,
            releases: [],
          };
          acc.push(changeset);
        }

        const release: Release | undefined = changeset.releases.find(
          (r: Release): boolean => r.name === change.packageName,
        );

        if (release) {
          const currentLevelIndex: number =
            BUMP_LEVELS.indexOf(release.type) || 0;
          const newLevelIndex = BUMP_LEVELS.indexOf(change.type);

          release.type = BUMP_LEVELS[
            Math.max(currentLevelIndex, newLevelIndex)
          ] as VersionType;
        } else {
          changeset.releases.push({
            name: change.packageName,
            type: change.type as VersionType,
          });
        }
      });

      return acc;
    },
    [] as Changeset[],
  );

  await Promise.all(
    changesets.map(
      async (changeset: Changeset): Promise<string> =>
        await writeChangeset(changeset, baseDir),
    ),
  );
};

main();
