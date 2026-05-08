import { MonoAutoAwesome, MonoLink } from '@kda-community/kode-icons/system';
import { Stack, Text } from '@kda-community/kode-ui';
import { FC, PropsWithChildren } from 'react';
import { chainClass } from './style.css';

export const Badge: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Stack
      alignItems={'center'}
      className={chainClass}
      paddingInlineStart={'xs'}
      paddingInlineEnd={'xs'}
      borderRadius="sm"
      gap={'xxs'}
    >
      {children}
    </Stack>
  );
};

export const Chain: FC<{ chainId: string }> = ({ chainId }) => (
  <Stack>
    <Badge>
      <MonoLink fontSize={16} />
      <Text size="smallest" variant="code" color="inherit">
        {chainId.padStart(2, '0')}
      </Text>
    </Badge>
  </Stack>
);

export const AutoBadge: FC = () => (
  <Badge>
    <MonoAutoAwesome fontSize="0.75rem" /> Auto
  </Badge>
);
