import { ChainId, NetworkId } from '@kadena/types';

export const environment: {
  kadenaNetworkId: NetworkId;
  kadenaChainId: ChainId;
  kadenaHost: string;
} = {
  kadenaNetworkId: 'testnet06',
  kadenaChainId: '0',
  kadenaHost: 'api.testnet.chainweb-community.org',
};
