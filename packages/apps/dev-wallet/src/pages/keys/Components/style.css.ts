import { style } from '@kda-community/kode-ui';
import { tokens } from '@kda-community/kode-ui/styles';

export const keyItemClass = style({
  paddingInlineStart: tokens.kda.foundation.spacing.sm,
  background: tokens.kda.foundation.color.background.input.default,
});

export const keyColumnClass = style({
  flex: 1,
});
