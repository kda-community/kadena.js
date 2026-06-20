interface INetworks {
  mainnet: { network: 'mainnet01'; api: 'api.chainweb-community.org' };
  testnet: {
    network: 'testnet06';
    api: 'api.testnet.chainweb-community.org';
  };
}

export const networkMap: INetworks = {
  mainnet: { network: 'mainnet01', api: 'api.chainweb-community.org' },
  testnet: { network: 'testnet06', api: 'api.testnet.chainweb-community.org' },
} as const;
