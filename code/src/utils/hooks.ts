import { useSession } from 'next-auth/react';

export function useIsAdmin(): boolean {
  const session = useSession();
  const user = session.data?.user;
  return user?.email === process.env.NEXT_PUBLIC_GOOGLE_EMAIL;
}
