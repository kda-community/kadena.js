import { bufferToHex, getKadenaLedgerApp } from '@/utils/ledger';

import { useAsyncFn } from 'react-use';

// Status words a Ledger app returns when the user rejects the prompt:
// 0x6986 is sent by the Kadena app, 0x6985 is the generic Ledger "denied by the user"
const LEDGER_USER_REJECTED = [0x6985, 0x6986];

export type LedgerAddressVerificationStatus =
  | 'verified'
  | 'mismatch'
  | 'rejected'
  | 'error';

export interface ILedgerAddressVerification {
  status: LedgerAddressVerificationStatus;
  derivationPath: string;
  expectedPublicKey: string;
  devicePublicKey?: string;
  errorMessage?: string;
}

const isUserRejection = (error: unknown): boolean =>
  LEDGER_USER_REJECTED.includes(
    (error as { statusCode?: number } | undefined)?.statusCode ?? 0,
  );

/**
 * Shows the public key for `derivationPath` on the Ledger screen and asks the
 * user to confirm it. The key returned by the device is compared with the key
 * the page holds (`expectedPublicKey`).
 */
const useLedgerVerifyAddress = () => {
  return useAsyncFn(
    async (
      derivationPath: string,
      expectedPublicKey: string,
    ): Promise<ILedgerAddressVerification> => {
      try {
        const app = await getKadenaLedgerApp();
        const { publicKey } = await app.verifyAddress(derivationPath);
        const devicePublicKey = bufferToHex(publicKey);
        return {
          status:
            devicePublicKey === expectedPublicKey ? 'verified' : 'mismatch',
          derivationPath,
          expectedPublicKey,
          devicePublicKey,
        };
      } catch (error) {
        return {
          status: isUserRejection(error) ? 'rejected' : 'error',
          derivationPath,
          expectedPublicKey,
          errorMessage: error instanceof Error ? error.message : String(error),
        };
      }
    },
  );
};

export default useLedgerVerifyAddress;
