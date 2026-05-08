import type { IPactModules, PactReturnType } from '@kda-community/client';
import { Pact } from '@kda-community/client';
import { execution } from '@kda-community/client/fp';
import type { ChainId, NetworkId } from '@kda-community/types';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetBalanceInput {
  tokenId: string;
  accountName: string;
  chainId: ChainId;
  networkId: NetworkId;
  host?: IClientConfig['host'];
}

export const getTokenBalance = ({
  tokenId,
  accountName,
  chainId,
  networkId,
  host,
}: IGetBalanceInput) =>
  pipe(
    () =>
      Pact.modules['marmalade-v2.ledger']['get-balance'](tokenId, accountName),
    execution,
    dirtyReadClient<
      PactReturnType<IPactModules['marmalade-v2.ledger']['get-balance']>
    >({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )().execute();
