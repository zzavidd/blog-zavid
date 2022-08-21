import { signIn, useSession } from 'next-auth/react';
import React from 'react';

export default function AdminGateway({
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => {
      signIn('google');
    },
  });

  if (status === 'loading') {
    return null;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
