import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import React from 'react';

import { useIsAdmin } from 'utils/hooks';

export default function AdminGateway({ children }: React.PropsWithChildren) {
  const session = useSession({
    required: true,
    onUnauthenticated: async () => {
      await signIn('google');
    },
  });

  const router = useRouter();
  const isAdmin = useIsAdmin();

  if (session.status === 'loading') {
    return null;
  }

  if (!isAdmin) {
    void router.push('/');
    return null;
  }

  return <React.Fragment>{children}</React.Fragment>;
}

export function AdminLock({ children }: React.PropsWithChildren) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => {},
  });

  if (
    status === 'loading' ||
    session.user?.email !== process.env.NEXT_PUBLIC_GOOGLE_EMAIL
  ) {
    return null;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
