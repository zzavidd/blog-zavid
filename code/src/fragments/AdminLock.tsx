import { useSession } from 'next-auth/react';
import React from 'react';

export default function AdminLock({ children }: Partial<React.ReactPortal>) {
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => {},
  });

  if (status === 'loading') {
    return null;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
