import type { IPactModules, PactReturnType } from '@kda-community/client';
import { Pact } from '@kda-community/client';
import { execution } from '@kda-community/client/fp';
import type { ChainId, NetworkId } from '@kda-community/types';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetAccountBalanceInput {
  tokenId: string;
  accountName: string;
  chainId: ChainId;
  networkId: NetworkId;
  host?: IClientConfig['host'];
}

export const getAccountDetails = async ({
  tokenId,
  accountName,
  chainId,
  networkId,
  host,
}: IGetAccountBalanceInput) => {
  const result = await pipe(
    () => Pact.modules['marmalade-v2.ledger'].details(tokenId, accountName),
    execution,
    dirtyReadClient<
      PactReturnType<IPactModules['marmalade-v2.ledger']['details']>
    >({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )().execute();

  return result;
};
