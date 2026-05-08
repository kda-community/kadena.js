import { AssetsCard } from '@/Components/AssetsCard/AssetsCard';
import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { MonoDashboard } from '@kda-community/kode-icons/system';
import { Stack } from '@kda-community/kode-ui';
import { SideBarBreadcrumbsItem } from '@kda-community/kode-ui/patterns';

export function HomePage() {
  return (
    <>
      <SideBarBreadcrumbs icon={<MonoDashboard />}>
        <SideBarBreadcrumbsItem href="/">Your Assets</SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack gap={'lg'} flexDirection={'column'} width="100%">
        <AssetsCard />
      </Stack>
    </>
  );
}
