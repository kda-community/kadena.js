import type { IAccount } from '@devnet/utils';
import type { ICommandResult } from '@kda-community/client';
import { Pact, createSignWithKeypair, readKeyset } from '@kda-community/client';
import { submitClient } from '@kda-community/client-utils/core';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kda-community/client/fp';
import type { IPactDecimal } from '@kda-community/types';
import { dotenv } from '@utils/dotenv';
import { networkData } from '@utils/network';

export interface ICreateTokenInput {
  tokenId: string;
  creator: string;
  guard: IAccount;
  amount: IPactDecimal;
}

export async function mintToken({
  tokenId,
  creator,
  guard,
  amount,
}: ICreateTokenInput): Promise<ICommandResult> {
  const command = composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger'].mint(
        tokenId,
        creator,
        readKeyset('guard'),
        amount,
      ),
    ),
    addKeyset('guard', 'keys-all', ...guard.keys.map((key) => key.publicKey)),
    addSigner(
      guard.keys.map((key) => key.publicKey),
      (signFor) => [
        signFor('coin.GAS'),
        signFor('marmalade-v2.ledger.MINT', tokenId, creator, amount),
      ],
    ),
    setMeta({ senderAccount: guard.account, chainId: guard.chainId }),
  );

  const config = {
    host: dotenv.NETWORK_HOST,
    defaults: {
      networkId: networkData.networkId,
    },
    sign: createSignWithKeypair(guard.keys),
  };

  const result = await submitClient(config)(command).executeTo('listen');
  return result;
}
