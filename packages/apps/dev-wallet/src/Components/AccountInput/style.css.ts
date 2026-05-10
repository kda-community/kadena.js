import { atoms, vars } from '@kda-community/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const discoverdAccountClass = style([
  {
    backgroundColor: vars.colors.$layoutSurfaceCard,
    selectors: {
      '&:nth-child(odd)': {
        backgroundColor: vars.colors.$layoutSurfaceDefault,
      },
    },
  },
  atoms({
    padding: 'sm',
  }),
]);
