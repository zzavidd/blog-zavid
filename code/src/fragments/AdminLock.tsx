import { useSession } from 'next-auth/react';
import React from 'react';

export default function AdminLock({ children }: Partial<React.ReactPortal>) {
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
