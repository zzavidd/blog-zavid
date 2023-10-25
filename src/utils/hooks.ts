/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useSession } from 'next-auth/react';

import { trpc } from './trpc';

export function useIsAdmin(): boolean {
  const session = useSession();
  return session.data?.user?.email === process.env.NEXT_PUBLIC_GOOGLE_EMAIL;
}

export function useDiaryCategories() {
  return trpc.diaryCategory.findMany.useQuery();
}
