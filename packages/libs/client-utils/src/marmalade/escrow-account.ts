import type { IPactModules, PactReturnType } from '@kda-community/client';
import { Pact } from '@kda-community/client';
import { execution } from '@kda-community/client/fp';
import type { ChainId, NetworkId } from '@kda-community/types';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IEscrowAccountInput {
  saleId: string;
  chainId: ChainId;
  networkId: NetworkId;
  host?: IClientConfig['host'];
}

export const escrowAccount = ({
  saleId,
  chainId,
  networkId,
  host,
}: IEscrowAccountInput) =>
  pipe(
    () =>
      Pact.modules['marmalade-sale.conventional-auction']['escrow-account'](
        saleId,
      ),
    execution,
    dirtyReadClient<
      PactReturnType<
        IPactModules['marmalade-sale.conventional-auction']['escrow-account']
      >
    >({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )().execute();
