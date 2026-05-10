import { shorten } from '@/utils/helpers';
import { MonoKey } from '@kda-community/kode-icons/system';
import { Stack, Text } from '@kda-community/kode-ui';

export function Key({
  publicKey,
  shortening,
}: {
  publicKey: string;
  shortening?: number;
}) {
  return (
    <Stack gap={'sm'} alignItems={'center'}>
      <Text>
        <MonoKey />
      </Text>
      <Text>{shortening ? shorten(publicKey, shortening) : publicKey}</Text>
    </Stack>
  );
}
