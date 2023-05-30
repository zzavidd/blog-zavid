import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import SuperJSON from 'superjson';

import Settings from 'utils/settings';

import type { AppRouter } from '../server/routers/_app';

export const trpc = createTRPCNext<AppRouter>({
  config: () => ({
    links: [
      httpBatchLink({
        url: `${Settings.DOMAIN}/api/trpc`,
      }),
    ],
    queryClientConfig: {
      defaultOptions: {
        queries: {
          refetchOnMount: false,
          refetchInterval: false,
          refetchOnWindowFocus: false,
        },
        mutations: {
          retry: 2,
        },
      },
    },
    transformer: SuperJSON,
  }),
  ssr: true,
});
