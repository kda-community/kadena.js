import type { IPactModules, PactReturnType } from '@kda-community/client';
import { Pact } from '@kda-community/client';
import { execution } from '@kda-community/client/fp';
import type { ChainId, NetworkId } from '@kda-community/types';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetAuctionDetailsInput {
  saleId: string;
  chainId: ChainId;
  networkId: NetworkId;
  host?: IClientConfig['host'];
}

export const getQuoteInfo = async ({
  saleId,
  chainId,
  host,
  networkId,
}: IGetAuctionDetailsInput) =>
  pipe(
    () => Pact.modules['marmalade-v2.policy-manager']['get-quote-info'](saleId),
    execution,
    dirtyReadClient<
      PactReturnType<
        IPactModules['marmalade-v2.policy-manager']['get-quote-info']
      >
    >({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )().execute();
