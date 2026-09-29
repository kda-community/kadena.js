import { FormStatusNotification } from '@/components/Global/FormStatusNotification';
import { Toggle } from '@/components/Global/Toggle';
import type { DerivationMode } from '@/hooks/use-ledger-public-key';
import useLedgerPublicKey, {
  derivationModes,
  getDerivationPath,
} from '@/hooks/use-ledger-public-key';
import useLedgerVerifyAddress from '@/hooks/use-ledger-verify-address';
import {
  marginBottomOnError,
  tooltipInfoContainer,
} from '@/pagestyles/transactions/transfer/styles.css';
import { MonoInfo, MonoKey } from '@kadena/kode-icons/system';
import { Button, NumberField, Stack, Tooltip } from '@kadena/kode-ui';
import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { ConnectLedgerButton } from './connect-ledger-button';

export interface ILedgerDetailsProps {
  onLedgerKeyUpdate: (ledgerPublicKey: string) => void;
  onLedgerKeyMismatch: () => void;
  onKeyIdUpdate: (keyId: number) => void;
  onDerivationUpdate: (derivationMode: DerivationMode) => void;
}

export const LedgerDetails: FC<ILedgerDetailsProps> = ({
  onLedgerKeyUpdate,
  onLedgerKeyMismatch,
  onKeyIdUpdate,
  onDerivationUpdate,
}) => {
  const { t } = useTranslation('common');

  const [state, getter] = useLedgerPublicKey();
  const [verifyState, verifyAddress] = useLedgerVerifyAddress();

  const [keyIndex, setKeyIndex] = useState<number>();
  const [legacyToggleOn, setLegacyOn] = useState<boolean>(false);

  const derivationMode: DerivationMode = legacyToggleOn
    ? derivationModes[1]
    : derivationModes[0];

  useEffect(() => {
    onDerivationUpdate(derivationMode);
  }, [derivationMode, onDerivationUpdate]);

  useEffect(() => {
    // Whenever the keyIndex or derivation mode (legacy or not) changes, we need to get the public key
    if (typeof keyIndex === 'number') {
      void getter({ keyId: keyIndex, derivationMode });
    }
  }, [keyIndex, derivationMode, getter]);

  useEffect(() => {
    if (state.value) {
      onLedgerKeyUpdate(state.value);
    }
  }, [onLedgerKeyUpdate, state.value]);

  // The same path is used to sign the transaction (see sign-form.tsx)
  const derivationPath = getDerivationPath(keyIndex ?? 0, derivationMode);

  // Only show a verification result for the key and path currently loaded
  const verification =
    !verifyState.loading &&
    verifyState.value?.derivationPath === derivationPath &&
    verifyState.value.expectedPublicKey === state.value
      ? verifyState.value
      : undefined;

  const isKeyMismatch = verification?.status === 'mismatch';

  useEffect(() => {
    if (isKeyMismatch) {
      onLedgerKeyMismatch();
    }
  }, [isKeyMismatch, onLedgerKeyMismatch]);

  const showVerifyAddress = !!state.value && !state.loading;

  return (
    <>
      <Stack
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'flex-end'}
        marginBlockStart={'md'}
      >
        <Stack gap={'md'}>
          <NumberField
            startVisual={<MonoKey />}
            label={t('ledger-key-index')}
            onValueChange={(keyIndex) => {
              setKeyIndex(keyIndex);
              onKeyIdUpdate(keyIndex);
            }}
            defaultValue={0}
            isInvalid={!!state.error}
            errorMessage={
              state.error ? 'You need to connect to your Ledger device.' : ''
            }
            minValue={0}
            maxValue={99}
          />
          <div
            className={classNames(
              tooltipInfoContainer,
              state.error ? marginBottomOnError : null,
            )}
          >
            <Tooltip content={t('ledger tooltip content')} position={'top'}>
              <MonoInfo />
            </Tooltip>
          </div>
        </Stack>
        <Toggle
          label={t('is Legacy')}
          onClick={setLegacyOn}
          toggled={legacyToggleOn}
        />
      </Stack>
      {showVerifyAddress && (
        <Stack flexDirection="column" gap="md">
          <Stack justifyContent="flex-start">
            <Button
              variant="outlined"
              isLoading={verifyState.loading}
              loadingLabel={t('ledger-verify-address-pending-title')}
              onPress={() => verifyAddress(derivationPath, state.value!)}
            >
              {t('ledger-verify-address')}
            </Button>
          </Stack>
          {verifyState.loading && (
            <FormStatusNotification
              status="processing"
              title={t('ledger-verify-address-pending-title')}
              body={t('ledger-verify-address-pending', {
                publicKey: state.value,
              })}
            />
          )}
          {verification?.status === 'verified' && (
            <FormStatusNotification
              status="successful"
              title={t('ledger-verify-address-verified-title')}
              body={t('ledger-verify-address-verified', {
                publicKey: verification.devicePublicKey,
              })}
            />
          )}
          {verification?.status === 'rejected' && (
            <FormStatusNotification
              status="erroneous"
              title={t('ledger-verify-address-rejected-title')}
              body={t('ledger-verify-address-rejected')}
            />
          )}
          {verification?.status === 'mismatch' && (
            <FormStatusNotification
              status="erroneous"
              title={t('ledger-verify-address-mismatch-title')}
              body={t('ledger-verify-address-mismatch', {
                devicePublicKey: verification.devicePublicKey,
                expectedPublicKey: verification.expectedPublicKey,
              })}
            />
          )}
          {verification?.status === 'error' && (
            <FormStatusNotification
              status="erroneous"
              title={t('ledger-verify-address-error-title')}
              body={t('ledger-verify-address-error', {
                message: verification.errorMessage,
              })}
            />
          )}
        </Stack>
      )}
      <ConnectLedgerButton
        onPress={() => getter({ keyId: keyIndex ?? 0, derivationMode })}
        isLoading={state.loading}
        isConnected={!!state.value && !isKeyMismatch}
      />
    </>
  );
};
