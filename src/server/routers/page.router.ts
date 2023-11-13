import {
  PageDeleteArgsSchema,
  PageFindFirstArgsSchema,
  PageFindManyArgsSchema,
  PageUpdateArgsSchema,
} from 'schemas';
import PageAPI from 'server/api/pages';
import { procedure, router } from 'server/trpc';

export const pageRouter = router({
  findMany: procedure
    .input(PageFindManyArgsSchema)
    .query(({ input }) => PageAPI.findMany(input)),
  find: procedure
    .input(PageFindFirstArgsSchema)
    .query(({ input }) => PageAPI.find(input)),
  update: procedure
    .input(PageUpdateArgsSchema)
    .mutation(({ input }) => PageAPI.update(input)),
  delete: procedure
    .input(PageDeleteArgsSchema)
    .mutation(({ input }) => PageAPI.delete(input)),
});
