import { style } from '@kda-community/kode-ui';
import { globalStyle } from '@kda-community/kode-ui/styles';

export const truncateClass = style({});

globalStyle(`${truncateClass} > span`, {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  maxWidth: '150px',
});
