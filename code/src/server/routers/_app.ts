import DiaryAPI from 'server/api/diary';
import PageAPI from 'server/api/pages';
import PostAPI from 'server/api/posts';
import SubscriberAPI from 'server/api/subscribers';
import { zCreateSubscriberPayload } from 'utils/validators';

import { procedure, router } from '../trpc';

export const appRouter = router({
  getLatestDiaryEntry: procedure.query(() => DiaryAPI.getLatest()),
  getLatestReverie: procedure.query(() => PostAPI.getLatestReverie()),
  getHomePageContent: procedure.query(() => PageAPI.find({ slug: 'home' })),

  createSubscriber: procedure
    .input(zCreateSubscriberPayload)
    .mutation(({ input }) => SubscriberAPI.create(input)),
});

export type AppRouter = typeof appRouter;
