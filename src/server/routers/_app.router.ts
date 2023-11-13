import type { inferRouterInputs } from '@trpc/server';

import { router } from '../trpc';

import { diaryCategoryRouter, diaryRouter } from './diary.router';
import exclusiveRouter from './exclusive.router';
import moodRouter from './mood.router';
import { pageRouter } from './page.router';
import postRouter from './post.router';
import subscriberRouter from './subscriber.router';
import { wishlistCategoryRouter, wishlistRouter } from './wishlist.router';

export const appRouter = router({
  diary: diaryRouter,
  diaryCategory: diaryCategoryRouter,
  exclusive: exclusiveRouter,
  mood: moodRouter,
  page: pageRouter,
  post: postRouter,
  subscriber: subscriberRouter,
  wishlist: wishlistRouter,
  wishlistCategory: wishlistCategoryRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
