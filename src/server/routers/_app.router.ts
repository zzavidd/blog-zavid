import { DiaryStatus } from '@prisma/client';
import type { inferRouterInputs } from '@trpc/server';
import { z } from 'zod';

import {
  DiaryCategoryCreateOneSchema,
  DiaryCategoryDeleteOneSchema,
  DiaryCategoryUpdateOneSchema,
  DiaryCreateOneSchema,
  DiaryFindFirstSchema,
  DiaryFindManySchema,
  DiaryUpdateOneSchema,
  PageDeleteOneSchema,
  PageFindFirstSchema,
  PageFindManySchema,
  PageUpdateOneSchema,
} from 'schemas/schemas';
import DiaryAPI from 'server/api/diary';
import DiaryCategoryAPI from 'server/api/diaryCategory';
import PageAPI from 'server/api/pages';
import { zEmailPreviewType, zFindOptions } from 'utils/validators';

import { procedure, router } from '../trpc';

import exclusiveRouter from './exclusive.router';
import moodRouter from './mood.router';
import postRouter from './post.router';
import subscriberRouter from './subscriber.router';
import { wishlistCategoryRouter, wishlistRouter } from './wishlist.router';

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
          params: DiaryFindManySchema,
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
  exclusive: exclusiveRouter,
  mood: moodRouter,
  post: postRouter,
  subscriber: subscriberRouter,
  wishlist: wishlistRouter,
  wishlistCategory: wishlistCategoryRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
