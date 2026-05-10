import type { ICompactTableFormatterProps } from '@kda-community/kode-ui/patterns';
import React from 'react';
import type { UseFormRegister } from 'react-hook-form';

export interface IActionProps {
  name: 'select';
  register: UseFormRegister<{
    select: [];
  }>;
}

export const FormatCheckbox = ({ name, register }: IActionProps) => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    return (
      <input
        {...register(name, {})}
        type="checkbox"
        name={name}
        data-value={value}
        id={name}
        value={value}
      />
    );
  };
  return Component;
};
