import { DiaryStatus } from '@prisma/client';
import { z } from 'zod';

import {
  DiaryCreateOneSchema,
  DiaryFindFirstSchema,
  DiaryFindManySchema,
  DiaryUpdateOneSchema,
  PageDeleteOneSchema,
  PageFindFirstSchema,
  PageFindManySchema,
  SubscriberCreateOneSchema,
  SubscriberDeleteOneSchema,
  SubscriberFindFirstSchema,
  SubscriberFindManySchema,
  SubscriberUpdateOneSchema,
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
      .input(
        z.object({
          diary: DiaryCreateOneSchema,
          isPublish: z.boolean().optional(),
        }),
      )
      .mutation(({ input }) => DiaryAPI.create(input.diary, input.isPublish)),
    update: procedure
      .input(
        z.object({
          diary: DiaryUpdateOneSchema,
          isPublish: z.boolean().optional(),
        }),
      )
      .mutation(({ input }) => DiaryAPI.update(input.diary, input.isPublish)),
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
      preview: procedure
        .input(z.number())
        .mutation(({ input }) => DiaryAPI.publish(input)),
    }),
  }),
  page: router({
    findMany: procedure
      .input(PageFindManySchema)
      .query(({ input }) => PageAPI.findMany(input)),
    find: procedure
      .input(PageFindFirstSchema)
      .query(({ input }) => PageAPI.find(input)),
    delete: procedure
      .input(PageDeleteOneSchema)
      .mutation(({ input }) => SubscriberAPI.delete(input)),
  }),
  subscriber: router({
    find: procedure
      .input(SubscriberFindFirstSchema)
      .query(({ input }) => SubscriberAPI.find(input)),
    findMany: procedure
      .input(SubscriberFindManySchema)
      .query(({ input }) => SubscriberAPI.findMany(input)),
    create: procedure
      .input(SubscriberCreateOneSchema)
      .mutation(({ input }) => SubscriberAPI.create(input)),
    update: procedure
      .input(SubscriberUpdateOneSchema)
      .mutation(({ input }) => SubscriberAPI.update(input)),
    delete: procedure
      .input(SubscriberDeleteOneSchema)
      .mutation(({ input }) => SubscriberAPI.delete(input)),
  }),
});

export type AppRouter = typeof appRouter;
