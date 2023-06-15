import type { DiaryCategory } from '@prisma/client';
import type { UseTRPCQueryResult } from '@trpc/react-query/shared';
import { useSession } from 'next-auth/react';

import { trpc } from './trpc';

export function useIsAdmin(): boolean {
  const session = useSession();
  const user = session.data?.user;
  return user?.email === process.env.NEXT_PUBLIC_GOOGLE_EMAIL;
}

export function useDiaryCategories(): UseTRPCQueryResult<
  DiaryCategory[],
  unknown
> {
  return trpc.diaryCategory.findMany.useQuery();
}
