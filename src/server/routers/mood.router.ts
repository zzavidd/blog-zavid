import MoodCreateArgsSchema from 'schemas/outputTypeSchemas/MoodCreateArgsSchema';
import MoodDeleteArgsSchema from 'schemas/outputTypeSchemas/MoodDeleteArgsSchema';
import MoodFindManyArgsSchema from 'schemas/outputTypeSchemas/MoodFindManyArgsSchema';
import MoodUpdateArgsSchema from 'schemas/outputTypeSchemas/MoodUpdateArgsSchema';
import MoodAPI from 'server/api/mood';
import { procedure, router } from 'server/trpc';

const moodRouter = router({
  findMany: procedure
    .input(MoodFindManyArgsSchema)
    .query(({ input }) => MoodAPI.findMany(input)),
  create: procedure
    .input(MoodCreateArgsSchema)
    .mutation(({ input }) => MoodAPI.create(input)),
  update: procedure
    .input(MoodUpdateArgsSchema)
    .mutation(({ input }) => MoodAPI.update(input)),
  delete: procedure
    .input(MoodDeleteArgsSchema)
    .mutation(({ input }) => MoodAPI.delete(input)),
});

export default moodRouter;
