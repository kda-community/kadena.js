import type {
  ChainId,
  ICommand,
  IKeyPair,
  IQuicksignResponse,
  ISigningRequest,
  IUnsignedCommand,
} from '@kadena/client';
import type { Guard, KeySet } from './guard';

/**
 * Represents a Kadena Network (e.g., mainnet01).
 * Conforms to KIP-0039 and KIP-0040.
 */
export interface INetworkInfo {
  networkName: string; // The display name of the network (e.g., "mainnet").
  networkId: string; // The unique identifier for the network (e.g., "mainnet01").
  urls: string[]; // The root endpoint URL(s) of the network.
}

/**
 * An optional secretKey, ensuring that private keys can be omitted.
 */
export type OptionalKeyPair = Omit<IKeyPair, 'secretKey'> & {
  secretKey?: string;
};

/**
 * Represents a Kadena account.
 * Conforms to KIP-0037 and KIP-0038.
 */
export interface IAccountInfo {
  accountName: string; // The unique identifier for the account.
  label?: string;
  networkId: string; // The unique identifier for the network for this account.
  contract: string; // Identifier for the fungible token contract.
  guard: Guard; // If available, otherwise fall back to keyset.
  keyset: KeySet;
  existsOnChains: string[]; // Array of chain IDs where this account exists.
}

export interface IProvider {
  request(args: { method: string; [key: string]: any }): Promise<unknown>;
  on(event: string, listener: (...args: any[]) => void): void;
  off(event: string, listener: (...args: any[]) => void): void;
}

export type KdaConnectOptions = Record<string, any>;

export type ISigningRequestPartial = {
  caps: ISigningRequest['caps'];
  code: string;
} & Omit<Partial<ISigningRequest>, 'caps' | 'pactCode'>;

export type CommandSigDatas = {
  cmd: string;
  sigs: {
    pubKey: string;
    sig: string | null;
  }[];
}[];

export interface IBaseWalletAdapterOptions {
  provider: IProvider;
  networkId?: string;
}

export interface IBaseWalletFactoryOptions {
  networkId?: string;
}

export type AdapterFactoryCreator = <T extends IBaseWalletFactoryOptions>(
  options: T,
) => {
  name: string;
  detect(): Promise<IProvider | null>;
  adapter(provider: IProvider): Promise<IAdapter>;
};

export type AdapterFactory = ReturnType<AdapterFactoryCreator>;

export interface IAdapterFactoryData {
  name: string;
  detected: boolean;
}

/**
 * The standardized Adapter interface.
 * (Wallets/Adapters implement these methods).
 */
export interface IAdapter {
  name: string;
  request(args: { method: string; [key: string]: any }): Promise<unknown>;

  on(event: string, listener: (...args: any[]) => void): this;
  off(event: string, listener: (...args: any[]) => void): this;

  connect(params?: unknown): Promise<IAccountInfo | null>;
  disconnect(): Promise<void>;
  getActiveAccount(): Promise<IAccountInfo>;
  getAccounts(): Promise<IAccountInfo[]>;
  getActiveNetwork(): Promise<INetworkInfo>;
  getNetworks(): Promise<INetworkInfo[]>;
  signTransaction(
    transaction: IUnsignedCommand | IUnsignedCommand[],
  ): Promise<(IUnsignedCommand | ICommand) | (IUnsignedCommand | ICommand)[]>;
  signCommand(
    command: ISigningRequestPartial | IUnsignedCommand,
  ): Promise<ICommand | IUnsignedCommand>;

  onAccountChange(cb: (newAccount: IAccountInfo) => void): void;
  onNetworkChange(cb: (newNetwork: INetworkInfo) => void): void;
}

export interface IJsonRpcSuccess<T> {
  id: number;
  jsonrpc: '2.0';
  result: T;
}

export interface IJsonRpcError {
  id: number;
  jsonrpc: '2.0';
  error: {
    code: number;
    message: string;
    data?: object;
  };
}

export type JsonRpcResponse<T> = IJsonRpcSuccess<T> | IJsonRpcError;

/**
 * Core "kadena_*" method definitions (aligned with the spec).
 * Here we define the shape of each method's `params` and `response`.
 */

export interface IKdaMethodMap {
  kadena_connect: {
    params: KdaConnectOptions;
    response: JsonRpcResponse<any>;
  };
  kadena_disconnect: {
    params: { networkId?: string };
    response: JsonRpcResponse<void>;
  };
  kadena_getAccount_v1: {
    params: {};
    response: JsonRpcResponse<IAccountInfo>;
  };
  kadena_getAccounts_v2: {
    params: {};
    response: JsonRpcResponse<IAccountInfo[]>;
  };
  kadena_getNetwork_v1: {
    params: {};
    response: JsonRpcResponse<INetworkInfo>;
  };
  kadena_changeNetwork_v1: {
    params: { networkId: string };
    response: JsonRpcResponse<{ success: boolean; reason?: string }>;
  };
  kadena_getNetworks_v1: {
    params: {};
    response: JsonRpcResponse<INetworkInfo[]>;
  };
  kadena_sign_v1: {
    params: ISigningRequestPartial;
    response: JsonRpcResponse<{
      body: ICommand | IUnsignedCommand;
      chainId: ChainId;
    }>;
  };
  kadena_quicksign_v1: {
    params: { commandSigDatas: CommandSigDatas };
    response: JsonRpcResponse<IQuicksignResponse>;
  };
}

export type KdaMethod = keyof IKdaMethodMap;

export type KdaRequestArgs<M extends KdaMethod> = {
  method: M;
} & { params?: IKdaMethodMap[M]['params'] };

export type {
  ChainId,
  ICommand,
  IKeyPair,
  IUnsignedCommand,
} from '@kadena/client';
