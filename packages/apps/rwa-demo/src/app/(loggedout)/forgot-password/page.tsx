'use client';
import { Card } from '@kda-community/kode-ui';
import { CardContentBlock } from '@kda-community/kode-ui/patterns';

import { ForgotPasswordForm } from '@/components/Forms/ForgotPasswordForm/ForgotPasswordForm';
import { ResetPasswordForm } from '@/components/Forms/ResetPasswordForm/ResetPasswordForm';
import { useSearchParams } from 'next/navigation';
import { cardWrapperClass } from '../style.css';

const Home = () => {
  const searchParams = useSearchParams();
  const oobCode = decodeURIComponent(searchParams.get('oobCode') ?? ''); // gets ?foo=value

  return (
    <Card fullWidth className={cardWrapperClass}>
      <CardContentBlock
        title={oobCode ? 'Reset password' : 'Forgot password'}
        description={
          oobCode
            ? 'Carefully select your password as this will be your main security of your wallet'
            : 'Enter your email to reset your password.'
        }
      >
        {oobCode ? (
          <ResetPasswordForm oobCode={oobCode} />
        ) : (
          <ForgotPasswordForm />
        )}
      </CardContentBlock>
    </Card>
  );
};

export default Home;
