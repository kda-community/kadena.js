import { IUnsignedCommand } from '@kda-community/client';
import { base64UrlEncodeArr } from '@kda-community/cryptography-utils';
import { normalizeTx } from './normalizeSigs';

export const getCopyTxString = (tx: IUnsignedCommand) => {
  const encodedTx = base64UrlEncodeArr(
    new TextEncoder().encode(
      JSON.stringify(
        normalizeTx({
          hash: tx.hash,
          cmd: tx.cmd,
          sigs: tx.sigs,
        }),
      ),
    ),
  );

  const baseUrl = `${window.location.protocol}//${window.location.host}`;

  return `${baseUrl}/sig-builder#${encodedTx}`;
};
