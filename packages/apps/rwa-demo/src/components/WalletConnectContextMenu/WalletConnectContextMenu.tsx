import { WALLETTYPES } from '@/constants';
import { ContextMenuItem } from '@kda-community/kode-ui';
import type { FC } from 'react';

export const WalletConnectContextMenu: FC<{
  handleConnect: (type: keyof typeof WALLETTYPES) => void;
}> = ({ handleConnect }) => {
  return (
    <ContextMenuItem
      label="Wallet Connect"
      onClick={() => handleConnect(WALLETTYPES.WALLETCONNECT)}
    />
  );
};
