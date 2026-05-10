import type { IHeadingProps } from '@kda-community/kode-ui';
import { Heading as UIHeading } from '@kda-community/kode-ui';
import type { FC } from 'react';
import { headingClass } from './style.css';

export const Heading: FC<IHeadingProps> = ({ children, ...props }) => {
  return (
    <UIHeading {...props} className={headingClass}>
      {children}
    </UIHeading>
  );
};
