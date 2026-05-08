import type {
  ChainId,
  IPactModules,
  PactReturnType,
} from '@kda-community/client';
import { Pact } from '@kda-community/client';
import { execution } from '@kda-community/client/fp';

import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

import { pipe } from 'ramda';

/**
 * @alpha
 */
export const readHistory = (
  account: string,
  chainId: ChainId,
  faucetContract: string = 'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet',
  networkId: string = 'testnet04',
  host?: IClientConfig['host'],
) => {
  const getDetails = pipe(
    (name) =>
      Pact.modules[
        faucetContract as 'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet'
      ]['read-history'](name),
    execution,
    dirtyReadClient<
      PactReturnType<
        IPactModules['n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet']['read-history']
      >
    >({
      host,
      defaults: {
        networkId: networkId,
        meta: { chainId },
      },
    }),
  );
  return getDetails(account).execute();
};
