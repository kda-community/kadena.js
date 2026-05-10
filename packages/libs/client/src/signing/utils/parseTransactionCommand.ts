import type { ICommand, IUnsignedCommand } from '@kda-community/types';
import type { IPactCommand } from '../../interfaces/IPactCommand';

/**
 * parse a ICommand or IUnsignedCommand JSON object to IPactCommand
 *
 * @internal
 */
export const parseTransactionCommand: (
  transaction: IUnsignedCommand | ICommand,
) => IPactCommand = (transaction) => {
  return JSON.parse(transaction.cmd);
};
