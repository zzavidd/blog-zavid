import { createServerSideHelpers } from '@trpc/react-query/server';
import type { GetServerSidePropsContext } from 'next';
import SuperJSON from 'superjson';

import { appRouter } from 'server/routers/_app';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getServerSideHelpers(ctx: GetServerSidePropsContext) {
  return createServerSideHelpers({
    ctx,
    router: appRouter,
    transformer: SuperJSON,
  });
}
