import {
  MoodCreateOneSchema,
  MoodDeleteOneSchema,
  MoodFindManySchema,
  MoodUpdateOneSchema,
} from 'schemas/schemas';
import MoodAPI from 'server/api/mood';
import { procedure, router } from 'server/trpc';

const moodRouter = router({
  findMany: procedure
    .input(MoodFindManySchema)
    .query(({ input }) => MoodAPI.findMany(input)),
  create: procedure
    .input(MoodCreateOneSchema)
    .mutation(({ input }) => MoodAPI.create(input)),
  update: procedure
    .input(MoodUpdateOneSchema)
    .mutation(({ input }) => MoodAPI.update(input)),
  delete: procedure
    .input(MoodDeleteOneSchema)
    .mutation(({ input }) => MoodAPI.delete(input)),
});

export default moodRouter;
