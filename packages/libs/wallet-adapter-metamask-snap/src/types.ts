import type { IKdaMethodMap as StandardKdaMethodMap } from '@kadena/wallet-adapter-core';
/** Metadata for a single installed Snap */
export interface ISnapMetadata {
  /** Snap package origin (same as the key) */
  id: string;
  /** Version string published by the snap */
  version: string;
  /** Whether the user has enabled this snap */
  enabled: boolean;
  /** Whether the snap is currently blocked */
  blocked: boolean;
}

/**
 * The full return type of `provider.request({ method: 'wallet_getSnaps' })`
 * Maps a snap origin (e.g. "npm:metamask/example-snap") to its metadata.
 */
export type GetSnapsResult = Record<string, ISnapMetadata>;

export interface ISnapNetwork {
  id: string;
  name: string;
  networkId: string;
  blockExplorerTransaction: string;
  blockExplorerAddress: string;
  blockExplorerAddressTransactions: string;
  isTestnet: boolean;
  nodeUrl: string;
  transactionListUrl: string;
  transactionListTtl: number;
  buyPageUrl: string;
}

export interface IAddAccountResponse {
  address: string;
  publicKey: string;
  index: number;
}

export interface ISnapAccount {
  id: string;
  index: number;
  address: string;
  name: string;
  publicKey: string;
}

/**
 * Represents a quicksign signature as defined in the quicksign API.
 * The signature is a string if present, or null if no signature is provided.
 */
export type IQuicksignSig = string | null;

/**
 * Represents a signer for the quicksign API.
 *
 * Contains the public key and the corresponding signature.
 */
export interface IQuicksignSigner {
  pubKey: string;
  sig: IQuicksignSig;
}

/**
 * Represents the command data within a quicksign response.
 *
 * This includes the command string and an array of signers with their signatures.
 */
export interface IQuicksignResponseCommand {
  sigs: IQuicksignSigner[];
  cmd: string;
}

/**
 * Represents the outcomes of a successful quicksign API response.
 *
 * Contains an array of response objects where each object includes the command signature data and the outcome.
 *
 * The outcome can be one of:
 * - Success: Contains a hash and a result string 'success'.
 * - Failure: Contains an error message and a result string 'failure'.
 * - No Signature: Indicates that no signature was provided, with a result string 'noSig'.
 */
export interface IQuicksignResponseOutcomes {
  responses: {
    commandSigData: IQuicksignResponseCommand;
    outcome:
      | {
          hash: string;
          result: 'success';
        }
      | {
          msg: string;
          result: 'failure';
        }
      | {
          result: 'noSig';
        };
  }[];
}

/**
 * Error response from {@link https://github.com/kadena-io/KIPs/blob/master/kip-0017.md | quicksign API}
 */
export declare interface IQuicksignResponseError {
  error:
    | {
        type: 'reject';
      }
    | {
        type: 'emptyList';
      }
    | {
        type: 'other';
        msg: string;
      };
}

/**
 * Response from {@link https://github.com/kadena-io/KIPs/blob/master/kip-0017.md | quicksign API}
 */
export declare type IQuicksignResponse =
  | IQuicksignResponseError
  | IQuicksignResponseOutcomes;

/**
 * Represents a raw response from the wallet adapter provider.
 *
 * The response includes a status and an optional message.
 */
export interface IRawRequestResponse {
  status: 'success' | 'fail';
  message?: string;
}

/**
 * Represents a raw response containing account information from the provider.
 *
 * The response includes a status, an optional message, and an optional wallet object with account details.
 */
export interface IRawAccountResponse {
  status: string;
  message?: string;
  wallet?: { account: string; publicKey: string };
}

/**
 * Represents a raw network response from the provider.
 *
 * Contains the network name, unique network identifier, and URL.
 */
export interface IRawNetworkResponse {
  name: string;
  networkId: string;
  url: string;
}

/**
 * Represents the response from a kadena_checkStatus RPC call.
 *
 * This response includes the status, an optional message, and optionally account details.
 */
export interface IKadenaCheckStatusRPC {
  /**
   * The status of the checkStatus call.
   */
  status: string;

  message?: string;

  account?: {
    chainId: string;
    account: string;
    publicKey: string;
  };
}

/**
 * Represents the extended method map specific to Snaps.
 *
 * Contains custom methods specific to Snap, such as a custom checkStatus.
 */
export interface ISnapMethodMap {
  /**
   * Custom method for checking wallet status.
   *
   * @param params - Optional parameters including networkId.
   * @returns The response from the kadena_checkStatus RPC.
   */
  kadena_checkStatus: {
    params: { networkId?: string };
    response: IKadenaCheckStatusRPC;
  };
}

/**
 * ExtendedMethodMap combines the standard KdaMethodMap with Ecko-specific methods.
 */
export type ExtendedMethodMap = StandardKdaMethodMap & ISnapMethodMap;

/**
 * ExtendedMethod represents the keys of the ExtendedMethodMap.
 */
export type ExtendedMethod = keyof ExtendedMethodMap;
