import { hash as blakeHash } from '@kda-community/cryptography-utils';
import type { IUnsignedCommand } from '@kda-community/types';
import type { IPartialPactCommand } from '../interfaces/IPactCommand';

/**
 * Prepare a transaction object. Creates an object with hash, cmd and sigs ({@link @kda-community/types#IUnsignedCommand})
 * @public
 */
export const createTransaction: (
  pactCommand: IPartialPactCommand,
) => IUnsignedCommand = (pactCommand) => {
  const cmd = JSON.stringify(pactCommand);
  const hash = blakeHash(cmd);
  return {
    cmd,
    hash,
    sigs: Array.from(Array(pactCommand.signers?.length ?? 0)),
  };
};
