import { darkThemeClass } from '@kda-community/kode-ui/styles';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { useTheme } from '../hooks/useTheme';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  useTheme();

  return (
    <NextThemeProvider
      attribute="class"
      value={{
        light: 'light',
        dark: darkThemeClass,
      }}
      enableSystem={true}
      enableColorScheme={true}
    >
      {children}
    </NextThemeProvider>
  );
};
