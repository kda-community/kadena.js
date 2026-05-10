import {
  ChainweaverAlphaLogoKdacolorDark,
  ChainweaverAlphaLogoKdacolorLight,
} from '@kda-community/kode-icons/product';
import { useTheme } from '@kda-community/kode-ui';
import { FC } from 'react';

export const ChainWeaverLogo: FC<{ width?: number; height?: number }> = (
  props,
) => {
  const { theme } = useTheme();

  return theme === 'dark' ? (
    <ChainweaverAlphaLogoKdacolorDark {...props} />
  ) : (
    <ChainweaverAlphaLogoKdacolorLight {...props} />
  );
};
