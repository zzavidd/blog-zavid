import {
  SubscriberCreateArgsSchema,
  SubscriberDeleteArgsSchema,
  SubscriberFindFirstArgsSchema,
  SubscriberFindManyArgsSchema,
  SubscriberUpdateArgsSchema,
} from 'schemas';
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
