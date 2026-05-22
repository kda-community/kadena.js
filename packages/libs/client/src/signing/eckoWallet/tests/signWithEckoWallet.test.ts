import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
/** @vitest-environment jsdom */

import type {
  IExecutionPayloadObject,
  IPactCommand,
  IPartialPactCommand,
} from '../../../interfaces/IPactCommand';
import { createTransaction } from '../../../utils/createTransaction';
import { createEckoWalletSign } from '../signWithEckoWallet';

import { IUnsignedCommand } from '@kadena/types';
import { TextDecoder, TextEncoder } from 'node:util';

type Transaction = IPactCommand & { payload: IExecutionPayloadObject };

Object.assign(global, { TextDecoder, TextEncoder });

describe('signWithEckoWallet', () => {
  const getTransaction = (): Transaction => ({
    payload: {
      exec: {
        code: '(coin.transfer "bonnie" "clyde" 1)',
        data: {
          test: 'test-data',
        },
      },
    },
    meta: {
      chainId: '0',
      gasLimit: 2300,
      gasPrice: 0.00000001,
      sender: 'test-sender',
      ttl: 3600,
      creationTime: 123456789,
    },
    signers: [
      {
        pubKey: '',
        clist: [
          {
            name: 'cap.test-cap-name',
            args: ['test-cap-arg'],
          },
        ],
      },
    ],
    networkId: 'test-network-id',
    nonce: 'kjs-test',
  });

  const mockEckoRequest = vi.fn();

  Object.defineProperty(window, 'kadena', {
    value: {
      isKadena: true,
      request: mockEckoRequest,
    },
    writable: true,
  });

  beforeEach(() => {
    mockEckoRequest.mockReset();
  });

  afterAll(() => {
    mockEckoRequest.mockRestore();
  });

  it('signs a transaction', async () => {
    mockEckoRequest.mockResolvedValue({
      status: 'success',
      signedCmd: { cmd: 'test-cmd', sigs: [{ sig: 'test-sig' }] },
    });

    const signWithEckoWallet = createEckoWalletSign();
    const transaction: Transaction = getTransaction();
    const unsignedTransaction = createTransaction(transaction);
    const signedTransaction = await signWithEckoWallet(unsignedTransaction);

    expect(mockEckoRequest).toHaveBeenCalledWith({
      method: 'kda_requestSign',
      data: {
        networkId: 'test-network-id',
        signingCmd: {
          code: transaction.payload.exec.code,
          data: transaction.payload.exec.data,
          caps: [
            {
              role: 'test-cap-name',
              description: 'Description for cap.test-cap-name',
              cap: {
                name: 'cap.test-cap-name',
                args: ['test-cap-arg'],
              },
            },
          ],
          nonce: transaction.nonce,
          chainId: transaction.meta.chainId,
          gasLimit: transaction.meta.gasLimit,
          gasPrice: transaction.meta.gasPrice,
          sender: transaction.meta.sender,
          ttl: transaction.meta.ttl,
        },
      },
    });

    expect(signedTransaction.cmd).toBe('test-cmd');

    expect(signedTransaction).toEqual({
      cmd: 'test-cmd',
      sigs: [{ sig: 'test-sig' }],
    });
  });

  it('throws when there is no signing response', async () => {
    const signWithEckoWallet = createEckoWalletSign();

    const transaction = getTransaction();
    delete transaction.payload.exec;
    const unsignedTransaction = createTransaction(transaction);

    await expect(() =>
      signWithEckoWallet(unsignedTransaction),
    ).rejects.toThrowError('`cont` transactions are not supported');
  });

  it('adds an empty clist when signer.clist is undefined', async () => {
    mockEckoRequest.mockResolvedValue({
      status: 'success',
      signedCmd: { cmd: 'test-cmd', sigs: [{ sig: 'test-sig' }] },
    });

    const signWithEckoWallet = createEckoWalletSign();

    const transaction = getTransaction();
    delete transaction.signers[0].clist;

    const unsignedTransaction = createTransaction(transaction);
    await signWithEckoWallet(unsignedTransaction);

    expect(window.kadena?.request).toHaveBeenCalledWith({
      method: 'kda_requestSign',
      data: {
        networkId: 'test-network-id',
        signingCmd: {
          code: transaction.payload.exec.code,
          data: transaction.payload.exec.data,
          caps: [],
          nonce: transaction.nonce,
          chainId: transaction.meta.chainId,
          gasLimit: transaction.meta.gasLimit,
          gasPrice: transaction.meta.gasPrice,
          sender: transaction.meta.sender,
          ttl: transaction.meta.ttl,
        },
      },
    });
  });

  it('throws when signing cont command', async () => {
    const transaction = getTransaction();
    const signWithEckoWallet = createEckoWalletSign();
    const unsignedTransaction = createTransaction(transaction);

    await expect(() =>
      signWithEckoWallet(unsignedTransaction),
    ).rejects.toThrowError('Error signing transaction');
  });
});
