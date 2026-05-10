import type { IPactModules, PactReturnType } from '@kda-community/client';
import { Pact } from '@kda-community/client';
import { execution } from '@kda-community/client/fp';
import type { ChainId, NetworkId } from '@kda-community/types';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetCollectionTokenInput {
  tokenId: string;
  chainId: ChainId;
  networkId: NetworkId;
  host?: IClientConfig['host'];
}

export const getCollectionToken = ({
  tokenId,
  chainId,
  networkId,
  host,
}: IGetCollectionTokenInput) =>
  pipe(
    () =>
      Pact.modules['marmalade-v2.collection-policy-v1']['get-token'](tokenId),
    execution,
    dirtyReadClient<
      PactReturnType<
        IPactModules['marmalade-v2.collection-policy-v1']['get-token']
      >
    >({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )().execute();
