import { createServerSideHelpers } from '@trpc/react-query/server';
import { GetServerSidePropsContext } from 'next';
import { appRouter } from 'server/routers/_app';
import SuperJSON from 'superjson';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getServerSideHelpers(ctx: GetServerSidePropsContext) {
  return createServerSideHelpers({
    ctx,
    router: appRouter,
    transformer: SuperJSON,
  });
}
