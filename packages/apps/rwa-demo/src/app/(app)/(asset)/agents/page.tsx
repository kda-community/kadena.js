'use client';

import { AgentsList } from '@/components/AgentsList/AgentsList';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { SideBarBreadcrumbsItem } from '@kda-community/kode-ui/patterns';

const AgentsPage = () => {
  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem href="/agents">Agents</SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>
      <AgentsList />
    </>
  );
};

export default AgentsPage;
