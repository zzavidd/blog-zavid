import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';

export default function AdminGateway({
  children,
  onlyBlockInStaging,
}: AdminGatewayProps) {
  if (onlyBlockInStaging && process.env.NEXT_PUBLIC_APP_ENV !== 'staging') {
    return <React.Fragment>{children}</React.Fragment>;
  }

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: async () => {
      await signIn('google');
    },
  });
  const router = useRouter();

  if (status === 'loading') {
    return null;
  }

  if (
    status === 'authenticated' &&
    session.user?.email !== process.env.NEXT_PUBLIC_GOOGLE_EMAIL
  ) {
    void router.push('/');
    return null;
  }

  return <React.Fragment>{children}</React.Fragment>;
}

interface AdminGatewayProps extends Partial<React.ReactPortal> {
  onlyBlockInStaging?: true;
}
