import { getBalance } from '@kda-community/client-utils/coin';

getBalance('albert', 'testnet04', '1')
  .then((balance) => {
    console.log('balance:', balance);
  })
  .catch(console.error);
