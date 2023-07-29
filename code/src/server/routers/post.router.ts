import { z } from 'zod';

import {
  PostCreateOneSchema,
  PostFindFirstSchema,
  PostFindManySchema,
  PostUpdateOneSchema,
} from 'schemas/schemas';
import PostAPI from 'server/api/posts';
import { procedure, router } from 'server/trpc';
import { zFindOptions } from 'utils/validators';

const postRouter = router({
  findMany: procedure
    .input(
      z.object({
        params: PostFindManySchema,
        options: zFindOptions,
      }),
    )
    .query(({ input }) => PostAPI.findMany(input.params, input.options)),
  find: procedure
    .input(
      z.object({
        params: PostFindFirstSchema,
        options: zFindOptions,
      }),
    )
    .query(({ input }) => PostAPI.find(input.params, input.options)),
  create: procedure
    .input(
      z.object({
        post: PostCreateOneSchema,
        isPublish: z.boolean().optional(),
      }),
    )
    .mutation(({ input }) => PostAPI.create(input.post, input.isPublish)),
  update: procedure
    .input(
      z.object({
        post: PostUpdateOneSchema,
        isPublish: z.boolean().optional(),
      }),
    )
    .mutation(({ input }) => PostAPI.update(input.post, input.isPublish)),
  delete: procedure
    .input(z.array(z.number()))
    .mutation(({ input }) => PostAPI.delete(input)),
});

export default postRouter;
