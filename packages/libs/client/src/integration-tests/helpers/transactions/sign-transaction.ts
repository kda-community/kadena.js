import { sign } from '@kda-community/cryptography-utils';
import type { ICommand, IUnsignedCommand } from '@kda-community/types';

export function signByKeyPair(
  transaction: IUnsignedCommand,
  keyPair: { publicKey: string; secretKey: string },
): ICommand {
  const { sig } = sign(transaction.cmd, keyPair);
  if (sig === undefined) {
    throw new Error('SIG_IS_UNDEFINED');
  }
  transaction.sigs = [{ sig }];
  return transaction as ICommand;
}
