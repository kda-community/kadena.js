import type {
  BuiltInPredicate,
  ChainId,
  IPactModules,
  PactReference,
  PactReturnType,
} from '@kda-community/client';
import { Pact, readKeyset } from '@kda-community/client';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kda-community/client/fp';
import type { IPactInt } from '@kda-community/types';
import { submitClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';
import type { CommonProps } from './config';
import { formatWebAuthnSigner } from './helpers';

interface ICreateCollectionInput extends Pick<CommonProps, 'meta'> {
  id: string;
  name: string;
  size: IPactInt | PactReference;
  chainId: ChainId;
  operator: {
    account: string;
    guard: {
      keys: string[];
      pred: BuiltInPredicate;
    };
  };
}

const createCollectionCommand = ({
  id,
  name,
  size,
  operator,
  chainId,
  meta,
}: ICreateCollectionInput) =>
  composePactCommand(
    execution(
      Pact.modules['marmalade-v2.collection-policy-v1']['create-collection'](
        id,
        name,
        size,
        readKeyset('operator-guard'),
      ),
    ),
    setMeta({ senderAccount: operator.account, chainId }),
    addKeyset('operator-guard', operator.guard.pred, ...operator.guard.keys),
    addSigner(formatWebAuthnSigner(operator.guard.keys), (signFor) => [
      signFor('coin.GAS'),
      signFor(
        'marmalade-v2.collection-policy-v1.COLLECTION',
        id,
        name,
        size,
        operator.guard,
      ),
    ]),
    setMeta({ senderAccount: operator.account, chainId, ...meta }),
  );

export const createCollection = (
  inputs: ICreateCollectionInput,
  config: IClientConfig,
) =>
  submitClient<
    PactReturnType<
      IPactModules['marmalade-v2.collection-policy-v1']['create-collection']
    >
  >(config)(createCollectionCommand(inputs));
