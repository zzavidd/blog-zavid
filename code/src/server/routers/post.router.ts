import { z } from 'zod';

import { PostFindFirstSchema } from 'schemas/schemas';
import PostAPI from 'server/api/posts';
import { procedure, router } from 'server/trpc';
import { zFindOptions } from 'utils/validators';

const postRouter = router({
  find: procedure
    .input(
      z.object({
        params: PostFindFirstSchema,
        options: zFindOptions,
      }),
    )
    .query(({ input }) => PostAPI.find(input.params, input.options)),
});

export default postRouter;
