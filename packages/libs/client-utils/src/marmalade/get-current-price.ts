import type { IPactModules, PactReturnType } from '@kda-community/client';
import { Pact } from '@kda-community/client';
import { execution } from '@kda-community/client/fp';
import type { ChainId, NetworkId } from '@kda-community/types';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetCurrentPriceInput {
  saleId: string;
  chainId: ChainId;
  networkId: NetworkId;
  host?: IClientConfig['host'];
}

export const getCurrentPrice = ({
  saleId,
  chainId,
  networkId,
  host,
}: IGetCurrentPriceInput) =>
  pipe(
    () =>
      Pact.modules['marmalade-sale.dutch-auction']['get-current-price'](saleId),
    execution,
    dirtyReadClient<
      PactReturnType<
        IPactModules['marmalade-sale.dutch-auction']['get-current-price']
      >
    >({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )().execute();
