import { readFileSync } from 'node:fs';

let stdin: string | null = null;

/** should only be done once per execution, and BEFORE any prompts from inquirer */
export async function readStdin(): Promise<string | null> {
  if (stdin !== null) {
    return stdin;
  }

  try {
    await import('ttys');
    const tmp = readFileSync(0, 'utf8');
    if (tmp !== '') stdin = tmp;
  } catch {
    /* empty */
  }

  return stdin;
}
