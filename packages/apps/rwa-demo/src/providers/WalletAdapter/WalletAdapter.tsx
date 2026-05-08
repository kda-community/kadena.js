import { createChainweaverAdapter } from '@kda-community/wallet-adapter-chainweaver';
import { createEckoAdapter } from '@kda-community/wallet-adapter-ecko';
import { createMagicAdapter } from '@kda-community/wallet-adapter-magic';
import { KadenaWalletProvider } from '@kda-community/wallet-adapter-react';
import { createWalletConnectAdapter } from '@kda-community/wallet-adapter-walletconnect';
import type { PropsWithChildren } from 'react';

export const WalletAdapterProvider = ({ children }: PropsWithChildren) => {
  return (
    <KadenaWalletProvider
      adapters={[
        createEckoAdapter(),
        createMagicAdapter({
          magicApiKey: process.env.NEXT_PUBLIC_MAGIC_APIKEY,
          chainwebApiUrl: process.env.NEXT_PUBLIC_CHAINWEBAPIURL,
          chainId: process.env.NEXT_PUBLIC_CHAINID,
          networkId: process.env.NEXT_PUBLIC_NETWORKID,
        }),
        createChainweaverAdapter({
          appName: 'RWA Demo',
        }),
        createWalletConnectAdapter({
          networkId: process.env.NEXT_PUBLIC_NETWORKID,
          projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECTID,
          relayUrl: 'wss://relay.walletconnect.com',
        }),
      ]}
    >
      {children}
    </KadenaWalletProvider>
  );
};
