import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { WORKING_DIRECTORY } from '../../../constants/config.js';
import { services } from '../../../services/index.js';
import { runCommandJson } from '../../../utils/test.util.js';

describe('wallet list command', () => {
  const walletPath = path.join(
    WORKING_DIRECTORY,
    '.kadena/wallets/list-test.yaml',
  );
  const wallet2Path = path.join(
    WORKING_DIRECTORY,
    '.kadena/wallets/list-test2.yaml',
  );

  afterEach(async () => {
    await services.filesystem.deleteFile(walletPath).catch(() => {});
    await services.filesystem.deleteFile(wallet2Path).catch(() => {});
  });

  it('list existing wallets', async () => {
    await runCommandJson('wallet add -w list-test --quiet', {
      stdin: '12345678',
    });
    await runCommandJson('wallet add -w list-test2 --quiet', {
      stdin: '12345678',
    });

    const result = await runCommandJson(`wallet list -w all --quiet`);
    expect(result['list-test'].filepath).toEqual(walletPath);
    expect(result['list-test'].seed).toEqual(undefined);
    expect(result['list-test'].legacy).toEqual(false);
    expect(result['list-test'].keys.length).toEqual(1);

    expect(result['list-test2'].filepath).contains(wallet2Path);
    expect(result['list-test2'].seed).toEqual(undefined);
    expect(result['list-test2'].legacy).toEqual(false);
    expect(result['list-test2'].keys.length).toEqual(1);
  }, 15000);

  it('list specific wallets', async () => {
    await runCommandJson('wallet add -w list-test --quiet', {
      stdin: '12345678',
    });

    const result = await runCommandJson(`wallet list -w list-test --quiet`);
    expect(result.filepath).toEqual(walletPath);
    expect(result.seed).toEqual(undefined);
    expect(result.legacy).toEqual(false);
    expect(result.keys.length).toEqual(1);
  }, 10000);
});
