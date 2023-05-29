import { z } from 'zod';

import {
  DiaryCreateOneSchema,
  DiaryFindFirstSchema,
  DiaryFindManySchema,
  DiaryUpdateOneSchema,
  SubscriberCreateOneSchema,
} from 'schemas/schemas';
import DiaryAPI from 'server/api/diary';
import PageAPI from 'server/api/pages';
import PostAPI from 'server/api/posts';
import SubscriberAPI from 'server/api/subscribers';

import { procedure, router } from '../trpc';

export const appRouter = router({
  diary: router({
    find: procedure
      .input(DiaryFindFirstSchema)
      .query(({ input }) => DiaryAPI.find(input)),
    findMany: procedure
      .input(DiaryFindManySchema)
      .query(({ input }) => DiaryAPI.findMany(input)),
    create: procedure
      .input(DiaryCreateOneSchema)
      .mutation(({ input }) => DiaryAPI.create(input)),
  }),
  getDiary: procedure
    .input(DiaryFindManySchema)
    .query(({ input }) => DiaryAPI.findMany(input)),
  updateDiaryEntry: procedure
    .input(DiaryUpdateOneSchema)
    .mutation(({ input }) => DiaryAPI.update(input)),
  deleteDiaryEntry: procedure
    .input(z.array(z.number()))
    .mutation(({ input }) => DiaryAPI.delete(input)),

  getDiaryTriplet: procedure
    .input(z.number())
    .query(({ input }) => DiaryAPI.getTriplet(input)),
  getLatestDiaryEntry: procedure.query(() => DiaryAPI.getLatest()),
  getDiaryPageContent: procedure.query(() => PageAPI.find({ slug: 'diary' })),

  getLatestReverie: procedure.query(() => PostAPI.getLatestReverie()),

  getPageBySlug: procedure
    .input(z.string())
    .query(({ input }) => PageAPI.find({ slug: input })),
  getHomePageContent: procedure.query(() => PageAPI.find({ slug: 'home' })),

  createSubscriber: procedure
    .input(SubscriberCreateOneSchema)
    .mutation(({ input }) => SubscriberAPI.create(input)),
});

export type AppRouter = typeof appRouter;
