/**
 * @public
 */
export type ChainwebHostGenerator = (options: {
  networkId: string;
  chainId: string;
}) => string;

/**
 * @public
 */
export type GraphqlHostGenerator = (options: { networkId: string }) => string;

const chainwebHostMap: Record<string, string | string[]> = {
  mainnet01: 'https://api.chainweb-community.org',
  testnet06: 'https://api.testnet.chainweb-community.org',
  testnet05: 'https://api.testnet.chainweb-community.org',
};

export const defaultChainwebHostGenerator: ChainwebHostGenerator = (
  options,
) => {
  return `${chainwebHostMap[options.networkId]}/chainweb/0.0/${options.networkId}/chain/${options.chainId}/pact`;
};

const graphqlHostMap: Record<string, string> = {
  mainnet01: 'https://graph.kadena.network/graphql',
  testnet06: 'https://graph.testnet.kadena.network/graphql',
  testnet05: 'https://graph.testnet.kadena.network/graphql',
};

export const defaultGraphqlHostGenerator: GraphqlHostGenerator = (options) => {
  if (graphqlHostMap[options.networkId] === undefined) {
    console.warn(
      `[defaultGraphqlHostGenerator] Network ${options.networkId} not supported`,
    );
  }
  return graphqlHostMap[options.networkId];
};
