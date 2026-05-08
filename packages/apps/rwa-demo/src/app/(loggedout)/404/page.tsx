'use client';
import { useUser } from '@/hooks/user';
import {
  Button,
  Card,
  Stack,
  Text,
  Link as UILink,
} from '@kda-community/kode-ui';
import { CardContentBlock } from '@kda-community/kode-ui/patterns';
import Link from 'next/link';
import { cardWrapperClass } from '../style.css';

const Home = () => {
  const { signOut, user } = useUser();

  return (
    <Card fullWidth className={cardWrapperClass}>
      <CardContentBlock title="404" description="Well, this is awkward...">
        <Text>
          We checked every corner of the internet — no page. Just dust.
        </Text>

        <Stack
          gap="md"
          width="100%"
          justifyContent="flex-end"
          marginBlockStart="xxxl"
        >
          <UILink variant="outlined" component={Link} href="/">
            Go home
          </UILink>
          {user?.uid && <Button onClick={signOut}>Sign out</Button>}
        </Stack>
      </CardContentBlock>
    </Card>
  );
};

export default Home;
