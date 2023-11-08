import SubscriberCreateArgsSchema from 'schemas/outputTypeSchemas/SubscriberCreateArgsSchema';
import SubscriberDeleteArgsSchema from 'schemas/outputTypeSchemas/SubscriberDeleteArgsSchema';
import SubscriberFindFirstArgsSchema from 'schemas/outputTypeSchemas/SubscriberFindFirstArgsSchema';
import SubscriberFindManyArgsSchema from 'schemas/outputTypeSchemas/SubscriberFindManyArgsSchema';
import SubscriberUpdateArgsSchema from 'schemas/outputTypeSchemas/SubscriberUpdateArgsSchema';
import SubscriberAPI from 'server/api/subscribers';
import { procedure, router } from 'server/trpc';

const subscriberRouter = router({
  find: procedure
    .input(SubscriberFindFirstArgsSchema)
    .query(({ input }) => SubscriberAPI.find(input)),
  findMany: procedure
    .input(SubscriberFindManyArgsSchema)
    .query(({ input }) => SubscriberAPI.findMany(input)),
  create: procedure
    .input(SubscriberCreateArgsSchema)
    .mutation(({ input }) => SubscriberAPI.create(input)),
  update: procedure
    .input(SubscriberUpdateArgsSchema)
    .mutation(({ input }) => SubscriberAPI.update(input)),
  delete: procedure
    .input(SubscriberDeleteArgsSchema)
    .mutation(({ input }) => SubscriberAPI.delete(input)),
});

export default subscriberRouter;
