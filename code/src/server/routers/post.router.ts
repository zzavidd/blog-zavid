import { z } from 'zod';

import { PostFindFirstSchema, PostFindManySchema } from 'schemas/schemas';
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
  delete: procedure
    .input(z.array(z.number()))
    .mutation(({ input }) => PostAPI.delete(input)),
});

export default postRouter;
