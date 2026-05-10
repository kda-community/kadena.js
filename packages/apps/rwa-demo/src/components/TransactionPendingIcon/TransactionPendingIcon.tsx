import { MonoLoading } from '@kda-community/kode-icons';
import React from 'react';
import { loaderClass } from './styles.css';

export const TransactionPendingIcon = () => {
  return <MonoLoading className={loaderClass} />;
};
