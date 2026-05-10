import type {
  BuiltInPredicate,
  ChainId,
  IPactModules,
  PactReturnType,
} from '@kda-community/client';
import { Pact, readKeyset } from '@kda-community/client';
import { addKeyset, execution } from '@kda-community/client/fp';
import type { NetworkId } from '@kda-community/types';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface ICreateCollectionIdInput {
  collectionName: string;
  operator: {
    guard: {
      keys: string[];
      pred: BuiltInPredicate;
    };
  };
  chainId: ChainId;
  networkId: NetworkId;
  host?: IClientConfig['host'];
}

export const createCollectionId = ({
  collectionName,
  operator,
  chainId,
  networkId,
  host,
}: ICreateCollectionIdInput) =>
  pipe(
    () =>
      Pact.modules['marmalade-v2.collection-policy-v1']['create-collection-id'](
        collectionName,
        readKeyset('operator-guard'),
      ),
    execution,
    addKeyset('operator-guard', operator.guard.pred, ...operator.guard.keys),
    dirtyReadClient<
      PactReturnType<
        IPactModules['marmalade-v2.collection-policy-v1']['create-collection-id']
      >
    >({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )().execute();
