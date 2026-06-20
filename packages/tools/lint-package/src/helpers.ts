import JSONC from 'jsonc-parser';
import fs from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { Rules } from './types.js';

const DIRNAME = dirname(fileURLToPath(import.meta.url));
const RULES_DIR = join(DIRNAME, 'rules');

async function importModules(dir: string) {
  const files = await fs.readdir(dir);
  const moduleFiles = files.filter((file) => extname(file) === '.js');
  const modules: Rules = [];
  for (const file of moduleFiles) {
    const fullPath = join(dir, file);
    const module = await import(pathToFileURL(fullPath).href);
    modules.push(module.default);
  }
  return modules;
}

export const loadJSON = async <T>(filePath: string): Promise<T> =>
  JSON.parse(await fs.readFile(filePath, 'utf-8'));

export const loadJSONC = async <T>(filePath: string): Promise<T> =>
  JSONC.parse(await fs.readFile(filePath, 'utf-8'));

export const loadContents = async (filePath: string) =>
  await fs.readFile(filePath, 'utf-8');

export const loadRules = (dir: string) => importModules(join(RULES_DIR, dir));
