import type { AppKdaLike } from '@/utils/ledger';
import { getKadenaLedgerApp, hexToBuffer } from '@/utils/ledger';
import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider/next-13.5';
import I18nProvider from 'next-translate/I18nProvider';
import type { FC } from 'react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import common from '../../../../../../locales/en/common.json';
import type { ISenderFieldsProps } from '../sender-fields';
import { SenderFields } from '../sender-fields';
import type { FormData } from '../sign-form';
import { defaultValues, schema } from '../sign-form';

vi.mock('@/utils/ledger', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return { ...actual, getKadenaLedgerApp: vi.fn() };
});

vi.mock('@/context/connect-wallet-context', () => ({
  useWalletConnectClient: () => ({
    selectedNetwork: 'testnet04',
    networksData: [],
  }),
}));

vi.mock('@/hooks/use-account-chain-details-query', () => ({
  useAccountChainDetailsQuery: () => ({ isSuccess: false, data: undefined }),
}));

const KEY_INDEX_0 =
  '1d6c8a0c3a0f3a9d9b6c1a1f2e3d4c5b6a79880706050403020100ffeeddccbb';
const KEY_INDEX_3 =
  '3a6c8a0c3a0f3a9d9b6c1a1f2e3d4c5b6a79880706050403020100ffeeddccbb';
const OTHER_DEVICE_KEY =
  'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
const RECEIVER =
  'k:4b6c8a0c3a0f3a9d9b6c1a1f2e3d4c5b6a79880706050403020100ffeeddccbb';

const keyForPath = (path: string) =>
  path.endsWith("/3'/0/0") || path.endsWith('/0/3') ? KEY_INDEX_3 : KEY_INDEX_0;

const getPublicKey = vi.fn();
const verifyAddress = vi.fn();

const senderDataQuery = {
  data: undefined,
  error: null,
  isFetching: false,
} as unknown as ISenderFieldsProps['senderDataQuery'];

const TestForm: FC<{
  onValid: (data: FormData) => void;
  type?: ISenderFieldsProps['type'];
}> = ({ onValid, type = 'Ledger' }) => {
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
      receiver: RECEIVER,
      receiverChainId: '0',
      amount: 1,
    },
  });

  return (
    <MemoryRouterProvider>
      <I18nProvider lang="en" namespaces={{ common }}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onValid)}>
            <SenderFields
              type={type}
              onKeyIdUpdate={vi.fn()}
              onDerivationUpdate={vi.fn()}
              onChainUpdate={vi.fn()}
              senderDataQuery={senderDataQuery}
            />
            <button type="submit">Sign on Ledger</button>
          </form>
        </FormProvider>
      </I18nProvider>
    </MemoryRouterProvider>
  );
};

const setup = (type?: ISenderFieldsProps['type']) => {
  const onValid = vi.fn();
  const user = userEvent.setup();
  render(<TestForm onValid={onValid} type={type} />);
  return { onValid, user };
};

const connect = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'Connect Ledger' }));
  await screen.findByRole('button', { name: 'Verify on Ledger' });
};

const verify = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'Verify on Ledger' }));
};

describe('Ledger sender: verify on Ledger', () => {
  beforeEach(() => {
    getPublicKey.mockReset();
    verifyAddress.mockReset();
    getPublicKey.mockImplementation(async (path: string) => ({
      publicKey: hexToBuffer(keyForPath(path)),
      address: null,
    }));
    verifyAddress.mockImplementation(async (path: string) => ({
      publicKey: hexToBuffer(keyForPath(path)),
      address: null,
    }));
    vi.mocked(getKadenaLedgerApp).mockResolvedValue({
      getPublicKey,
      verifyAddress,
    } as unknown as AppKdaLike);
  });

  test('shows the button only after the key is loaded from the Ledger', async () => {
    const { user } = setup();

    expect(
      screen.queryByRole('button', { name: 'Verify on Ledger' }),
    ).not.toBeInTheDocument();

    await connect(user);

    expect(getPublicKey).toHaveBeenCalledTimes(1);
    expect(verifyAddress).not.toHaveBeenCalled();
  });

  test('does not show the button outside the Ledger flow', () => {
    setup('Coming soon…');

    expect(
      screen.queryByRole('button', { name: 'Verify on Ledger' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Connect Ledger' }),
    ).not.toBeInTheDocument();
  });

  test('verifies the derivation path the key was loaded from', async () => {
    const { user } = setup();
    await connect(user);

    await verify(user);

    await waitFor(() => expect(verifyAddress).toHaveBeenCalledTimes(1));
    expect(verifyAddress).toHaveBeenCalledWith(getPublicKey.mock.calls[0][0]);
    expect(verifyAddress).toHaveBeenCalledWith("m/44'/626'/0'/0/0");
  });

  test('verifies the path for the chosen key index and legacy mode', async () => {
    const { user } = setup();
    await connect(user);

    const keyIndexField = screen.getByRole('textbox', {
      name: 'Ledger Key Index',
    });
    await user.clear(keyIndexField);
    await user.type(keyIndexField, '3');
    await user.tab();
    await user.click(screen.getByRole('checkbox', { name: 'toggle' }));

    await waitFor(() =>
      expect(getPublicKey).toHaveBeenLastCalledWith("m/44'/626'/0'/0/3"),
    );
    await screen.findByRole('button', { name: 'Verify on Ledger' });

    await verify(user);

    await waitFor(() =>
      expect(verifyAddress).toHaveBeenCalledWith("m/44'/626'/0'/0/3"),
    );
    expect(await screen.findByText('Address verified')).toBeInTheDocument();
  });

  test('tells the user to check the device while the Ledger waits', async () => {
    let approve: () => void = () => {};
    verifyAddress.mockImplementation(
      (path: string) =>
        new Promise((resolve) => {
          approve = () =>
            resolve({
              publicKey: hexToBuffer(keyForPath(path)),
              address: null,
            });
        }),
    );
    const { user } = setup();
    await connect(user);

    await verify(user);

    expect(
      await screen.findByText(
        `Compare the address on your Ledger screen with ${KEY_INDEX_0}. Approve on the device only if they are identical.`,
      ),
    ).toBeInTheDocument();

    approve();

    expect(await screen.findByText('Address verified')).toBeInTheDocument();
  });

  test('shows the confirmed key when the device matches the page', async () => {
    const { user, onValid } = setup();
    await connect(user);

    await verify(user);

    expect(await screen.findByText('Address verified')).toBeInTheDocument();
    expect(
      screen.getByText(
        `You confirmed on your Ledger that ${KEY_INDEX_0} is the key of this device.`,
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Sign on Ledger' }));
    await waitFor(() => expect(onValid).toHaveBeenCalledTimes(1));
    expect(onValid.mock.calls[0][0].sender).toBe(`k:${KEY_INDEX_0}`);
  });

  test('shows a rejection when the user rejects on the device', async () => {
    verifyAddress.mockRejectedValue(
      Object.assign(new Error('Ledger device: UNKNOWN_ERROR (0x6986)'), {
        statusCode: 0x6986,
      }),
    );
    const { user } = setup();
    await connect(user);

    await verify(user);

    expect(
      await screen.findByText('Verification rejected'),
    ).toBeInTheDocument();
  });

  test('shows an error when the device cannot answer', async () => {
    verifyAddress.mockRejectedValue(
      Object.assign(new Error('Ledger device: Locked device (0x5515)'), {
        statusCode: 0x5515,
      }),
    );
    const { user } = setup();
    await connect(user);

    await verify(user);

    expect(
      await screen.findByText('Could not verify the address'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Details: Ledger device: Locked device \(0x5515\)/),
    ).toBeInTheDocument();
  });

  test('blocks the transfer when the device returns another key', async () => {
    verifyAddress.mockResolvedValue({
      publicKey: hexToBuffer(OTHER_DEVICE_KEY),
      address: null,
    });
    const { user, onValid } = setup();
    await connect(user);
    expect(screen.getByDisplayValue(`k:${KEY_INDEX_0}`)).toBeInTheDocument();

    await verify(user);

    expect(await screen.findByText('Public key mismatch')).toBeInTheDocument();
    expect(
      screen.getByText(
        `Your Ledger returned ${OTHER_DEVICE_KEY}, but this page loaded ${KEY_INDEX_0}. Signing is blocked. Connect your Ledger again to load the key from the device.`,
      ),
    ).toBeInTheDocument();
    // The stale key is no longer offered as the sender
    expect(
      screen.queryByDisplayValue(`k:${KEY_INDEX_0}`),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Connect Ledger' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Sign on Ledger' }));
    // Give the async resolver time to run before asserting a negative
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(onValid).not.toHaveBeenCalled();
  });

  test('clears the result when another key is loaded', async () => {
    const { user } = setup();
    await connect(user);
    await verify(user);
    expect(await screen.findByText('Address verified')).toBeInTheDocument();

    const keyIndexField = screen.getByRole('textbox', {
      name: 'Ledger Key Index',
    });
    await user.clear(keyIndexField);
    await user.type(keyIndexField, '3');
    await user.tab();

    await waitFor(() =>
      expect(screen.queryByText('Address verified')).not.toBeInTheDocument(),
    );
  });

  test('reconnecting after a mismatch loads the key for the chosen key index', async () => {
    const { user, onValid } = setup();
    await connect(user);

    const keyIndexField = screen.getByRole('textbox', {
      name: 'Ledger Key Index',
    });
    await user.clear(keyIndexField);
    await user.type(keyIndexField, '3');
    await user.tab();
    expect(
      await screen.findByDisplayValue(`k:${KEY_INDEX_3}`),
    ).toBeInTheDocument();

    // Another device is plugged in: it holds a different key at every path
    const otherDevice = async () => ({
      publicKey: hexToBuffer(OTHER_DEVICE_KEY),
      address: null,
    });
    getPublicKey.mockImplementation(otherDevice);
    verifyAddress.mockImplementation(otherDevice);

    await verify(user);
    expect(await screen.findByText('Public key mismatch')).toBeInTheDocument();

    getPublicKey.mockClear();
    await user.click(screen.getByRole('button', { name: 'Connect Ledger' }));

    await waitFor(() =>
      expect(getPublicKey).toHaveBeenCalledWith("m/44'/626'/3'/0/0"),
    );
    expect(
      await screen.findByDisplayValue(`k:${OTHER_DEVICE_KEY}`),
    ).toBeInTheDocument();
    expect(screen.queryByText('Public key mismatch')).not.toBeInTheDocument();

    await verify(user);
    expect(await screen.findByText('Address verified')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Sign on Ledger' }));
    await waitFor(() => expect(onValid).toHaveBeenCalledTimes(1));
    expect(onValid.mock.calls[0][0].sender).toBe(`k:${OTHER_DEVICE_KEY}`);
  });
});
