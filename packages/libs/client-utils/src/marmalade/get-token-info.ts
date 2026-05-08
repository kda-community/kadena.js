import type { IPactModules, PactReturnType } from '@kda-community/client';
import { Pact } from '@kda-community/client';
import { execution } from '@kda-community/client/fp';
import type { ChainId, NetworkId } from '@kda-community/types';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetTokenInfoInput {
  tokenId: string;
  chainId: ChainId;
  networkId: NetworkId;
  host?: IClientConfig['host'];
}

export const getTokenInfo = ({
  tokenId,
  chainId,
  networkId,
  host,
}: IGetTokenInfoInput) =>
  pipe(
    () => Pact.modules['marmalade-v2.ledger']['get-token-info'](tokenId),
    execution,
    dirtyReadClient<
      PactReturnType<IPactModules['marmalade-v2.ledger']['get-token-info']>
    >({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )().execute();
