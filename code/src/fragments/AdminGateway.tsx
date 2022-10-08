import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';

export default function AdminGateway({
  children,
  onlyBlockInStaging,
}: AdminGatewayProps) {
  const allow =
    onlyBlockInStaging && process.env.NEXT_PUBLIC_APP_ENV !== 'staging';

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: async () => {
      if (!allow) {
        await signIn('google');
      }
    },
  });
  const router = useRouter();

  if (allow) {
    return <React.Fragment>{children}</React.Fragment>;
  }

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
