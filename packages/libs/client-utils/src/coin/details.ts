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
export const details = (
  account: string,
  networkId: string,
  chainId: ChainId,
  host?: IClientConfig['host'],
  contract: string = 'coin',
) => {
  const getDetails = pipe(
    (name) => Pact.modules[contract as 'coin'].details(name),
    execution,
    dirtyReadClient<PactReturnType<IPactModules['coin']['details']>>({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  );
  return getDetails(account).execute();
};
