import { DiaryStatus } from '@prisma/client';
import { z } from 'zod';

import {
  DiaryCreateOneSchema,
  DiaryFindFirstSchema,
  DiaryFindManySchema,
  DiaryUpdateOneSchema,
  PageFindFirstSchema,
  SubscriberCreateOneSchema,
  SubscriberDeleteOneSchema,
  SubscriberFindManySchema,
} from 'schemas/schemas';
import DiaryAPI from 'server/api/diary';
import PageAPI from 'server/api/pages';
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
    update: procedure
      .input(DiaryUpdateOneSchema)
      .mutation(({ input }) => DiaryAPI.update(input)),
    delete: procedure
      .input(z.array(z.number()))
      .mutation(({ input }) => DiaryAPI.delete(input)),
    custom: router({
      latest: procedure.query(() =>
        DiaryAPI.find({
          orderBy: { entryNumber: 'desc' },
          where: { status: DiaryStatus.PUBLISHED },
        }),
      ),
      triple: procedure.input(z.number()).query(({ input }) =>
        DiaryAPI.findMany({
          where: {
            entryNumber: { in: [input, input - 1, input + 1] },
          },
        }),
      ),
    }),
  }),
  page: router({
    find: procedure
      .input(PageFindFirstSchema)
      .query(({ input }) => PageAPI.find(input)),
  }),
  subscriber: router({
    findMany: procedure
      .input(SubscriberFindManySchema)
      .query(({ input }) => SubscriberAPI.findMany(input)),
    create: procedure
      .input(SubscriberCreateOneSchema)
      .mutation(({ input }) => SubscriberAPI.create(input)),
    delete: procedure
      .input(SubscriberDeleteOneSchema)
      .mutation(({ input }) => SubscriberAPI.delete(input)),
  }),
});

export type AppRouter = typeof appRouter;
