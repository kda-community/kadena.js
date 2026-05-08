import type { ChainId, IKeyPair } from '@kda-community/types';

export interface IAccount {
  account: string;
  chains: ChainId[];
  keys: IKeyPair[];
}
