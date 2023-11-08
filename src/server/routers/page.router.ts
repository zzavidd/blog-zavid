import PageDeleteArgsSchema from 'schemas/outputTypeSchemas/PageDeleteArgsSchema';
import PageFindFirstArgsSchema from 'schemas/outputTypeSchemas/PageFindFirstArgsSchema';
import PageFindManyArgsSchema from 'schemas/outputTypeSchemas/PageFindManyArgsSchema';
import PageUpdateArgsSchema from 'schemas/outputTypeSchemas/PageUpdateArgsSchema';
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
