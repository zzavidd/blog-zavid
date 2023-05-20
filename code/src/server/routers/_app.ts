import DiaryAPI from 'private/api/diary';
import PageAPI from 'private/api/pages';
import PostAPI from 'private/api/posts';

import { procedure, router } from '../trpc';

export const appRouter = router({
  getLatestDiaryEntry: procedure.query(() => DiaryAPI.getLatest()),
  getLatestReverie: procedure.query(() => PostAPI.getLatestReverie()),
  getHomePageContent: procedure.query(() => PageAPI.getBySlug('home')),
});

export type AppRouter = typeof appRouter;
