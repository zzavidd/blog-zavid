import { signIn, useSession } from 'next-auth/react';
import React from 'react';

export default function AdminGateway({ children }: Partial<React.ReactPortal>) {
  const { status } = useSession({
    required: true,
    onUnauthenticated: async () => {
      await signIn('google');
    },
  });

  if (status === 'loading') {
    return null;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
