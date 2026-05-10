import type { IClient } from '@kda-community/client';
import { createClient } from '@kda-community/client';

const client = (apiHost: string): IClient => {
  return createClient(apiHost);
};

export default client;
