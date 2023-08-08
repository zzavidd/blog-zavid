import {
  SubscriberCreateOneSchema,
  SubscriberDeleteOneSchema,
  SubscriberFindFirstSchema,
  SubscriberFindManySchema,
  SubscriberUpdateOneSchema,
} from 'schemas/schemas';
import SubscriberAPI from 'server/api/subscribers';
import { procedure, router } from 'server/trpc';

const subscriberRouter = router({
  find: procedure
    .input(SubscriberFindFirstSchema)
    .query(({ input }) => SubscriberAPI.find(input)),
  findMany: procedure
    .input(SubscriberFindManySchema)
    .query(({ input }) => SubscriberAPI.findMany(input)),
  create: procedure
    .input(SubscriberCreateOneSchema)
    .mutation(({ input }) => SubscriberAPI.create(input)),
  update: procedure
    .input(SubscriberUpdateOneSchema)
    .mutation(({ input }) => SubscriberAPI.update(input)),
  delete: procedure
    .input(SubscriberDeleteOneSchema)
    .mutation(({ input }) => SubscriberAPI.delete(input)),
});

export default subscriberRouter;
