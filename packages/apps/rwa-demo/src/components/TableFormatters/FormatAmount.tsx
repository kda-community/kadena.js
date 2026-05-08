import { MonoArrowDropDown, MonoArrowDropUp } from '@kda-community/kode-icons';
import { Stack } from '@kda-community/kode-ui';
import type { ICompactTableFormatterProps } from '@kda-community/kode-ui/patterns';
import { formatAmountClass } from './style.css';

export interface IActionProps {}

export const FormatAmount = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    const innerValue = parseInt(value as string);
    return (
      <Stack
        width="100%"
        justifyContent="space-between"
        className={formatAmountClass({
          amount: innerValue < 0 ? 'negative' : 'positive',
        })}
      >
        {innerValue < 0 ? <MonoArrowDropDown /> : <MonoArrowDropUp />}
        <Stack gap="xs">{innerValue}</Stack>
      </Stack>
    );
  };
  return Component;
};
