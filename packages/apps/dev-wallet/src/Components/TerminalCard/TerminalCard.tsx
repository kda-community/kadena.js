import { Card } from '@kda-community/kode-ui';
import { FC, PropsWithChildren } from 'react';
import { terminalWrapperClass } from './style.css';

export const TerminalCard: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Card fullWidth className={terminalWrapperClass}>
      {children}
    </Card>
  );
};
