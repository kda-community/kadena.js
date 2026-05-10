import type { IAccount } from '@devnet/utils';
import { Pact, readKeyset } from '@kda-community/client';
import { dirtyReadClient } from '@kda-community/client-utils/core';
import {
  addKeyset,
  composePactCommand,
  execution,
  setMeta,
} from '@kda-community/client/fp';
import { dotenv } from '@utils/dotenv';
import { networkData } from '@utils/network';

interface ICreateTokenIdInput {
  policies?: string[];
  uri: string;
  precision?: { decimal: string } | { int: string };
  creator: IAccount;
}

export async function createTokenId({
  policies = [],
  uri,
  precision = { int: '0' },
  creator,
}: ICreateTokenIdInput): Promise<string> {
  return (await dirtyReadClient({
    host: dotenv.NETWORK_HOST,
    defaults: {
      networkId: networkData.networkId,
    },
  })(
    composePactCommand(
      execution(
        Pact.modules['marmalade-v2.ledger']['create-token-id'](
          { precision, uri, policies },
          readKeyset('creation-guard'),
        ),
      ),
      addKeyset(
        'creation-guard',
        'keys-all',
        ...creator.keys.map((key) => key.publicKey),
      ),
      setMeta({ senderAccount: creator.account, chainId: creator.chainId }),
    ),
  ).execute()) as string;
}
