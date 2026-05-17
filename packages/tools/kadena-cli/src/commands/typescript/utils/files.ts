import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const writeModulesJson = (content: string): void => {
  if (process.env.DEBUG === 'dev') {
    writeFileSync(join(process.cwd(), 'modules.json'), content);
  }
};
