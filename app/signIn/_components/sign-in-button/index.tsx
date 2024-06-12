'use client';

import { Button } from '@nextui-org/react';
import { signIn, useSession } from 'next-auth/react';
import { redirect, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const SignInButton = () => {
  const session = useSession();
  const searchParams = useSearchParams();
  const handleSignIn = async () => {
    await signIn('azure-ad', { redirect: false });
  };

  useEffect(() => {
    if (session.data) {
      redirect(searchParams.get('callbackUrl') || '/');
    }
  }, [session]);

  return (
    <Button color="secondary" onClick={handleSignIn}>
      <img src="./microsoft.svg" alt="microsoft" height={24} width={24} />
      <p className="uppercase">Sign in with microsoft</p>
    </Button>
  );
};

export default SignInButton;
