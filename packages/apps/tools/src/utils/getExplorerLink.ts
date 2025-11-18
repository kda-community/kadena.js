import { env } from "./env";

export const getExplorerLink = (
  requestKey: string,
  network: string,
  networksData: any[],
): string => {
  if (network === 'testnet04' || network === 'mainnet01') {
    return `https://${env("KADENA_EXPLORER", '')}/${network.slice(
      0,
      -2,
    )}/tx/${requestKey}`;
  }
  const networkData = networksData.find((item) => item.networkId === network);

  return `http://${networkData.API}/explorer/development/tx/${requestKey}`;
};
