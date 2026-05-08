import { MonoCopyAll } from '@kda-community/kode-icons/system';
import { Button } from '@kda-community/kode-ui';
import { ICompactTableFormatterProps } from '@kda-community/kode-ui/patterns';
import type { FC } from 'react';

type IProps = Exclude<ICompactTableFormatterProps, 'value'> & {
  value: string;
};

export const FormatCopyPaste: () => FC<IProps> =
  () =>
  ({ value }) => (
    <Button
      isCompact
      variant="outlined"
      onPress={() => {
        navigator.clipboard.writeText(value);
      }}
      endVisual={<MonoCopyAll />}
    />
  );
