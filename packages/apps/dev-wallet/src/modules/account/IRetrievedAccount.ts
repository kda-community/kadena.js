import { IGuard } from '@/modules/account/account.repository';
import { ChainId } from '@kda-community/client';

export interface IRetrievedAccount {
  alias?: string;
  address: string;
  chains: Array<{ chainId: ChainId; balance: string }>;
  overallBalance: string;
  guard: IGuard;
  keysToSignWith?: string[];
}
