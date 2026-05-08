import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { ISigner } from '@kda-community/client';

export const setSigner = (account: IWalletAccount): ISigner => {
  if (account.walletType === 'WebAuthn') {
    return { pubKey: account.publicKey, scheme: 'WebAuthn' };
  }

  return account.publicKey;
};
