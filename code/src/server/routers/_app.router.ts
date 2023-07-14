import { DiaryStatus } from '@prisma/client';
import type { inferRouterInputs } from '@trpc/server';
import { z } from 'zod';

import {
  DiaryCategoryCreateOneSchema,
  DiaryCategoryDeleteOneSchema,
  DiaryCategoryUpdateOneSchema,
  DiaryCreateOneSchema,
  DiaryFindFirstSchema,
  DiaryUpdateOneSchema,
  PageDeleteOneSchema,
  PageFindFirstSchema,
  PageFindManySchema,
  PageUpdateOneSchema,
  SubscriberCreateOneSchema,
  SubscriberDeleteOneSchema,
  SubscriberFindFirstSchema,
  SubscriberFindManySchema,
  SubscriberUpdateOneSchema,
} from 'schemas/schemas';
import DiaryAPI from 'server/api/diary';
import DiaryCategoryAPI from 'server/api/diaryCategory';
import PageAPI from 'server/api/pages';
import SubscriberAPI from 'server/api/subscribers';
import { zEmailPreviewType } from 'server/emails';
import { zFindOptions } from 'utils/validators';

import { procedure, router } from '../trpc';

import postRouter from './post.router';

export const appRouter = router({
  diary: router({
    find: procedure
      .input(
        z.object({
          params: DiaryFindFirstSchema,
          options: zFindOptions,
        }),
      )
      .query(({ input }) => DiaryAPI.find(input.params, input.options)),
    findMany: procedure
      .input(
        z.object({
          params: DiaryFindFirstSchema,
          options: zFindOptions,
        }),
      )
      .query(({ input }) => DiaryAPI.findMany(input.params, input.options)),
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
        DiaryAPI.find(
          {
            orderBy: { entryNumber: 'desc' },
            where: { status: DiaryStatus.PUBLISHED },
          },
          {
            contentWordLimit: 50,
          },
        ),
      ),
      preview: procedure
        .input(z.object({ id: z.number(), type: zEmailPreviewType }))
        .mutation(({ input }) => DiaryAPI.publish(input.id, input.type)),
    }),
  }),
  diaryCategory: router({
    findMany: procedure.query(() => DiaryCategoryAPI.findMany()),
    create: procedure
      .input(DiaryCategoryCreateOneSchema)
      .mutation(({ input }) => DiaryCategoryAPI.create(input)),
    update: procedure
      .input(DiaryCategoryUpdateOneSchema)
      .mutation(({ input }) => DiaryCategoryAPI.update(input)),
    delete: procedure
      .input(DiaryCategoryDeleteOneSchema)
      .mutation(({ input }) => DiaryCategoryAPI.delete(input)),
  }),
  page: router({
    findMany: procedure
      .input(PageFindManySchema)
      .query(({ input }) => PageAPI.findMany(input)),
    find: procedure
      .input(PageFindFirstSchema)
      .query(({ input }) => PageAPI.find(input)),
    update: procedure
      .input(PageUpdateOneSchema)
      .mutation(({ input }) => PageAPI.update(input)),
    delete: procedure
      .input(PageDeleteOneSchema)
      .mutation(({ input }) => PageAPI.delete(input)),
  }),
  post: postRouter,
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
export type RouterInput = inferRouterInputs<AppRouter>;
