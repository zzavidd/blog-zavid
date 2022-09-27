import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';

export default function AdminGateway({ children }: Partial<React.ReactPortal>) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: async () => {
      await signIn('google');
    },
  });
  const router = useRouter();

  if (status === 'loading') {
    return null;
  } else if (
    status === 'authenticated' &&
    session.user?.email !== process.env.NEXT_PUBLIC_GOOGLE_EMAIL
  ) {
    void router.push('/');
    return null;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
