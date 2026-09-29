import type { AppKdaLike } from '@/utils/ledger';
import { getKadenaLedgerApp, hexToBuffer } from '@/utils/ledger';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import useLedgerVerifyAddress from '../use-ledger-verify-address';

vi.mock('@/utils/ledger', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return { ...actual, getKadenaLedgerApp: vi.fn() };
});

const PATH = "m/44'/626'/2'/0/0";
const PAGE_KEY =
  '1d6c8a0c3a0f3a9d9b6c1a1f2e3d4c5b6a79880706050403020100ffeeddccbb';
const OTHER_KEY =
  'aa6c8a0c3a0f3a9d9b6c1a1f2e3d4c5b6a79880706050403020100ffeeddccbb';

const ledgerError = (message: string, statusCode: number) =>
  Object.assign(new Error(message), { statusCode });

describe('useLedgerVerifyAddress', () => {
  const verifyAddress = vi.fn();

  beforeEach(() => {
    verifyAddress.mockReset();
    vi.mocked(getKadenaLedgerApp).mockResolvedValue({
      verifyAddress,
    } as unknown as AppKdaLike);
  });

  const run = async () => {
    const { result } = renderHook(() => useLedgerVerifyAddress());
    await act(async () => {
      await result.current[1](PATH, PAGE_KEY);
    });
    return result.current[0].value;
  };

  test('asks the device to show the key for the given derivation path', async () => {
    verifyAddress.mockResolvedValue({
      publicKey: hexToBuffer(PAGE_KEY),
      address: null,
    });

    const value = await run();

    expect(verifyAddress).toHaveBeenCalledTimes(1);
    expect(verifyAddress).toHaveBeenCalledWith(PATH);
    expect(value).toEqual({
      status: 'verified',
      derivationPath: PATH,
      expectedPublicKey: PAGE_KEY,
      devicePublicKey: PAGE_KEY,
    });
  });

  test('reports a mismatch when the device returns another key', async () => {
    verifyAddress.mockResolvedValue({
      publicKey: hexToBuffer(OTHER_KEY),
      address: null,
    });

    const value = await run();

    expect(value?.status).toBe('mismatch');
    expect(value?.devicePublicKey).toBe(OTHER_KEY);
    expect(value?.expectedPublicKey).toBe(PAGE_KEY);
  });

  test.each([
    ['Ledger device: UNKNOWN_ERROR (0x6986)', 0x6986],
    [
      'Ledger device: Condition of use not satisfied (denied by the user?) (0x6985)',
      0x6985,
    ],
  ])(
    'reports a rejection when the user rejects on the device (%s)',
    async (message, statusCode) => {
      verifyAddress.mockRejectedValue(ledgerError(message, statusCode));

      const value = await run();

      expect(value?.status).toBe('rejected');
    },
  );

  test('reports other device errors, such as a locked device (0x5515)', async () => {
    verifyAddress.mockRejectedValue(
      ledgerError('Ledger device: Locked device (0x5515)', 0x5515),
    );

    const value = await run();

    expect(value?.status).toBe('error');
    expect(value?.errorMessage).toBe('Ledger device: Locked device (0x5515)');
  });

  test('reports an error when the device is busy with another request', async () => {
    verifyAddress.mockRejectedValue(
      new Error('Ledger Device is busy (lock verifyAddress)'),
    );

    const value = await run();

    expect(value?.status).toBe('error');
    expect(value?.errorMessage).toBe(
      'Ledger Device is busy (lock verifyAddress)',
    );
  });

  test('reports an error when the transport cannot be opened', async () => {
    vi.mocked(getKadenaLedgerApp).mockRejectedValue(
      new Error('Access denied to use Ledger device'),
    );

    const value = await run();

    expect(verifyAddress).not.toHaveBeenCalled();
    expect(value?.status).toBe('error');
    expect(value?.errorMessage).toBe('Access denied to use Ledger device');
  });
});
