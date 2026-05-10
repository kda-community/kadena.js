import { useEditAgent } from '@/hooks/editAgent';
import type { IRecord } from '@/utils/filterRemovedRecords';
import { MonoEditNote } from '@kda-community/kode-icons';
import { Button } from '@kda-community/kode-ui';
import type { ICompactTableFormatterProps } from '@kda-community/kode-ui/patterns';
import React from 'react';
import { AgentForm } from '../AgentForm/AgentForm';

export interface IActionProps {}

export const FormatEditAgent = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    const { isAllowed: isEditAgentAllowed } = useEditAgent();
    return (
      <AgentForm
        agent={value as unknown as IRecord}
        trigger={
          <Button
            aria-label="Edit agent"
            isDisabled={!isEditAgentAllowed}
            isCompact
            endVisual={<MonoEditNote />}
            variant="outlined"
          />
        }
      />
    );
  };
  return Component;
};
