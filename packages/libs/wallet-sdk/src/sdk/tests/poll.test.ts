import type { ChainId } from '@kadena/client';
import { addSignatures, isSignedTransaction } from '@kadena/client';
import {
  kadenaGenKeypairFromSeed,
  kadenaMnemonicToSeed,
  kadenaSignWithSeed,
} from '@kadena/hd-wallet';
import {
  afterEach,
  assert,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import type { ResponseResult } from '../schema.js';
import { walletSdk } from '../walletSdk.js';

describe('example test', () => {
  beforeEach(() => {
    vi.spyOn(walletSdk, 'sendTransaction').mockResolvedValue({
      requestKey: 'Yo41Id5PMVoaaSv6znT0sd0hiQBxbJoRNulDORKP0B4',
      chainId: '0',
      networkId: 'testnet06',
    });

    vi.spyOn(walletSdk, 'waitForPendingTransaction').mockResolvedValue({
      status: 'success',
      data: 'Write succeeded',
    } as ResponseResult);

    vi.spyOn(walletSdk, 'subscribePendingTransactions').mockImplementation(
      (transactions, callback) => {
        const mockResult = {
          status: 'success',
          data: 'Write succeeded',
        } as ResponseResult;
        callback(transactions[0], mockResult);
      },
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test(
    'example',
    async () => {
      const mnemonic =
        'replace piano limit frozen provide system layer holiday spring nation hire verify';
      const password = '12345678';
      const seed = await kadenaMnemonicToSeed(password, mnemonic);
      const [publicKey] = await kadenaGenKeypairFromSeed(password, seed, 0);
      const [publicKey2] = await kadenaGenKeypairFromSeed(password, seed, 1);

      const chainId = '0' as ChainId;
      const networkId = 'testnet06';

      walletSdk.logger.setTransport(console.log);

      const command = walletSdk.createTransferCreateCommand({
        amount: '0.01',
        sender: `k:${publicKey}`,
        receiver: {
          account: `k:${publicKey2}`,
          keyset: {
            keys: [publicKey2],
            pred: 'keys-all',
          },
        },
        chainId,
        networkId,
      });

      const signed = await kadenaSignWithSeed(password, seed, 0)(command.hash);
      const signedCommand = addSignatures(command, signed);

      assert(
        isSignedTransaction(signedCommand),
        'Transaction should be validly signed',
      );

      const transactionDescriptor = await walletSdk.sendTransaction(
        signedCommand,
        networkId,
        chainId,
      );

      const waitResult: ResponseResult =
        await walletSdk.waitForPendingTransaction(transactionDescriptor);

      const subscribeResult: ResponseResult = await new Promise((resolve) => {
        walletSdk.subscribePendingTransactions(
          [transactionDescriptor],
          (_, result) => {
            resolve(result);
          },
        );
      });

      expect(walletSdk.sendTransaction).toHaveBeenCalledWith(
        signedCommand,
        networkId,
        chainId,
      );

      expect(walletSdk.waitForPendingTransaction).toHaveBeenCalledWith(
        transactionDescriptor,
      );
      expect(waitResult.status).toEqual('success');

      expect(walletSdk.subscribePendingTransactions).toHaveBeenCalledWith(
        [transactionDescriptor],
        expect.any(Function),
      );
      expect(subscribeResult.status).toEqual('success');
    },
    {
      timeout: 15000,
    },
  );
});
