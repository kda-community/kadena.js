import type { INetworkCreateOptions } from '../../commands/networks/utils/networkHelpers.js';

export interface INetworks {
  mainnet: { network: 'mainnet01'; api: 'api.chainweb-community.org' };
  testnet: {
    network: 'testnet06';
    api: 'api.testnet.chainweb-community.org';
  };
}

export interface IContractRetrievalParams {
  module: string;
  apiHost: string;
  chain: number | string;
  network: string;
}

export interface IContractRetrievalResult {
  code: string;
  error?: string;
}

export interface IContractGenerateOptions {
  clean?: boolean;
  capsInterface?: string;
  file?: string[];
  contract?: string[];
  namespace?: string;
  api?: string;
  chainId?: number | string;
  network?: string;
  networkConfig?: INetworkCreateOptions;
  parseTreePath?: string;
}
