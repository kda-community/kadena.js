import { PreviewBanner } from '@/Components/PreviewBanner/PreviewBanner';
import { Button, ThemeAnimateIcon, useTheme } from '@kda-community/kode-ui';
import {
  FocussedLayout,
  FocussedLayoutFooter,
  FocussedLayoutHeaderAside,
  FocussedLayoutLogo,
  FocussedLayoutProvider,
  FocussedLayoutTopBanner,
} from '@kda-community/kode-ui/patterns';
import { FC, PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';

export const FocussedPageLayout: FC<PropsWithChildren> = ({ children }) => {
  const { theme, rotateTheme } = useTheme();

  return (
    <FocussedLayoutProvider>
      <FocussedLayoutTopBanner>
        <PreviewBanner maxWidth={1000} />
      </FocussedLayoutTopBanner>
      <FocussedLayout
        logo={
          <a href="/">
            <FocussedLayoutLogo />
          </a>
        }
      >
        <FocussedLayoutHeaderAside>
          <Button
            isCompact
            variant="outlined"
            onPress={rotateTheme}
            startVisual={<ThemeAnimateIcon theme={theme} />}
          />
        </FocussedLayoutHeaderAside>
        {children ? children : <Outlet />}
        <FocussedLayoutFooter />
      </FocussedLayout>
    </FocussedLayoutProvider>
  );
};
