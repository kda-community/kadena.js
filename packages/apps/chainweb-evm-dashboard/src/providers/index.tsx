import { MediaContextProvider } from '@kda-community/kode-ui';
import { SWRConfig } from 'swr';
import { useData } from '../hooks/useData';
import { chainOptions } from '../utils';
import { ThemeProvider } from './theme';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  useData();

  return (
    <SWRConfig
      value={{
        ...chainOptions,
        onError: (error) => {
          console.error('SWR Error:', error);
        },
      }}
    >
      <MediaContextProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </MediaContextProvider>
    </SWRConfig>
  );
};
