import { style } from '@kda-community/kode-ui';
import { globalStyle } from '@vanilla-extract/css';

export const assetsSwitchWrapperClass = style({
  width: '100%',
});

globalStyle(`${assetsSwitchWrapperClass} > section`, {
  flex: 1,
  width: '100%',
});
