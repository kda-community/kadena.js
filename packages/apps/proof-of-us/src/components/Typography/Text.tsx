import type { ITextProps } from '@kda-community/kode-ui';
import { Text as UIext } from '@kda-community/kode-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import { textClass } from './style.css';

export const Text: FC<ITextProps> = ({ children, ...props }) => {
  return (
    <UIext {...props} className={classNames(textClass, props.className)}>
      {children}
    </UIext>
  );
};
