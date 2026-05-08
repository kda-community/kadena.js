import type { IPactModules, PactReturnType } from '@kda-community/client';
import { Pact } from '@kda-community/client';
import { execution } from '@kda-community/client/fp';
import type { ChainId, NetworkId } from '@kda-community/types';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetEscrowInput {
  saleId: string;
  chainId: ChainId;
  networkId: NetworkId;
  host?: IClientConfig['host'];
}

export const getEscrowAccount = ({
  saleId,
  chainId,
  networkId,
  host,
}: IGetEscrowInput) =>
  pipe(
    () =>
      Pact.modules['marmalade-v2.policy-manager']['get-escrow-account'](saleId),
    execution,
    dirtyReadClient<
      PactReturnType<
        IPactModules['marmalade-v2.policy-manager']['get-escrow-account']
      >
    >({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )().execute();
