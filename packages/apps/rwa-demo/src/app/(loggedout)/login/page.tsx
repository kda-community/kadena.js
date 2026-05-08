'use client';
import { Card } from '@kda-community/kode-ui';
import { CardContentBlock } from '@kda-community/kode-ui/patterns';

import { LoginForm } from '@/components/LoginForm/LoginForm';
import { cardWrapperClass } from '../style.css';

const Home = () => {
  return (
    <Card fullWidth className={cardWrapperClass}>
      <CardContentBlock title="Login">
        <LoginForm />
      </CardContentBlock>
    </Card>
  );
};

export default Home;
