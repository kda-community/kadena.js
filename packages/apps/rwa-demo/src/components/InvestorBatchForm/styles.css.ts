import { style } from '@kda-community/kode-ui';

export const selectBoxClass = style({
  selectors: {
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});
