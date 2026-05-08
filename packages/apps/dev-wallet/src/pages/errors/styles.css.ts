import { style } from '@kda-community/kode-ui';
import { responsiveStyle, token } from '@kda-community/kode-ui/styles';

export const warningIconColorClass = style({
  color: token('color.icon.semantic.negative.default'),
});

export const wrapperClass = style({
  ...responsiveStyle({
    xs: {},
    md: { marginBlockStart: '-80px' },
  }),
});
