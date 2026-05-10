import { describeModule } from '@kda-community/client-utils/built-in';
import type { ChainId } from '@kda-community/types';

export async function retrieveContractFromChain(
  module: string,
  host: string,
  networkId: string,
  chainId: ChainId,
): Promise<string | undefined> {
  const moduleDescription = await describeModule(module, {
    host,
    defaults: {
      networkId,
      meta: {
        chainId,
      },
    },
  });

  return moduleDescription.code;
}
