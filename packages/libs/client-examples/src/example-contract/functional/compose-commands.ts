import { Pact } from '@kda-community/client';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
  setNetworkId,
} from '@kda-community/client/fp';

// you can compose command by using the createPactCommand util
export function composeCommands() {
  const mainnetConfig = composePactCommand(
    setMeta({ chainId: '1' }),
    setNetworkId('mainnet04'),
  );

  const transfer = composePactCommand(
    execution(
      Pact.modules.coin.transfer('javad', 'albert', { decimal: '0.1' }),
    ),
    addSigner('javadPublicKey', (signFor) => [
      signFor('coin.GAS'),
      signFor('coin.TRANSFER', 'javad', 'albert', { decimal: '0.1' }),
    ]),
  );

  return composePactCommand(mainnetConfig, transfer)();
}
