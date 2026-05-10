/**
 * To showcase the Kadena Wallet Adapter, this file sets up a React application
 *
 * Adapters provide a `AdapterFactory` that allow for lazy loading of the adapter
 * code. This is done by using `await import("./EckoAdapter")` in the
 * `adapter` method of the factory. This means that the adapter code is only loaded
 *
 * Steps to follow if you add more wallets:
 * - Import the respective adapter (e.g., `import { xAdapter } from "@kda-community/wallet-adapter-xwallet";`).
 * - Include it in the array for `adapters`.
 */

import '@kda-community/kode-ui/global';
import { darkThemeClass } from '@kda-community/kode-ui/styles';
import { createChainweaverAdapter } from '@kda-community/wallet-adapter-chainweaver';
import { createChainweaverLegacyAdapter } from '@kda-community/wallet-adapter-chainweaver-legacy';
import { createEckoAdapter } from '@kda-community/wallet-adapter-ecko';
import { createMagicAdapter } from '@kda-community/wallet-adapter-magic';
import { createSnapAdapter } from '@kda-community/wallet-adapter-metamask-snap';
import { KadenaWalletProvider } from '@kda-community/wallet-adapter-react';
import { createWalletConnectAdapter } from '@kda-community/wallet-adapter-walletconnect';
import { createZelcoreAdapter } from '@kda-community/wallet-adapter-zelcore';
import { ThemeProvider } from 'next-themes';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const networkId: 'testnet04' | 'mainnet01' = 'testnet04';

// List all adapters you want to use here.
const adapters = [
  createEckoAdapter(),
  createChainweaverAdapter(),
  createChainweaverLegacyAdapter(),
  createZelcoreAdapter(),
  createWalletConnectAdapter({
    debug: true,
    networkId,
  }),
  createSnapAdapter(),
  createMagicAdapter({
    chainId: '1',
    chainwebApiUrl:
      'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact',
    magicApiKey: import.meta.env.VITE_MAGIC_API_KEY,
    networkId,
  }),
];

// Render the React application, providing the adapters to KadenaWalletProvider.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider
      attribute="class"
      enableSystem={true}
      defaultTheme="light"
      value={{
        light: 'light',
        dark: darkThemeClass,
      }}
    >
      <KadenaWalletProvider adapters={adapters}>
        <App />
      </KadenaWalletProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
