import type { ChainId } from '@kadena/client';

const { VITE_KADENA_NETWORK_ID, VITE_KADENA_CHAIN_ID, VITE_KADENA_HOST } =
  import.meta.env;

export const NETWORK_ID: string = VITE_KADENA_NETWORK_ID;
export const CHAIN_ID: ChainId = VITE_KADENA_CHAIN_ID;
export const HOST: string = VITE_KADENA_HOST;

export const API_HOST = `https://${HOST}/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
