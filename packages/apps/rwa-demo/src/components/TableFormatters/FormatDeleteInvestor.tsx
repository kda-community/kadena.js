import { useDeleteInvestor } from '@/hooks/deleteInvestor';
import { MonoDelete } from '@kda-community/kode-icons';
import { Button } from '@kda-community/kode-ui';
import type { ICompactTableFormatterProps } from '@kda-community/kode-ui/patterns';
import React from 'react';
import { Confirmation } from '../Confirmation/Confirmation';

export interface IActionProps {}

export const FormatDeleteInvestor = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    const investorAccount = value as string;
    const {
      submit,
      isAllowed: isDeleteInvestorAllowed,
      notAllowedReason,
    } = useDeleteInvestor({
      investorAccount,
    });

    const handleDelete = async () => {
      await submit({ investor: investorAccount });
    };
    return (
      <Confirmation
        onPress={handleDelete}
        trigger={
          <Button
            aria-label="Delete investor"
            isDisabled={!isDeleteInvestorAllowed}
            title={notAllowedReason}
            isCompact
            variant="outlined"
            startVisual={<MonoDelete />}
          />
        }
      >
        Are you sure you want to delete this investor?
      </Confirmation>
    );
  };
  return Component;
};
