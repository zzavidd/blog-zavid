import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import SuperJSON from 'superjson';

import Settings from 'constants/settings';

import type { AppRouter } from '../server/routers/_app';

export const trpc = createTRPCNext<AppRouter>({
  config: () => ({
    links: [
      httpBatchLink({
        url: `${Settings.DOMAIN}/api/trpc`,
      }),
    ],
    transformer: SuperJSON,
  }),
  ssr: false,
});
