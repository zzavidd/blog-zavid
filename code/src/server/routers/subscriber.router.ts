import { z } from 'zod';

import {
  SubscriberCreateOneSchema,
  SubscriberDeleteOneSchema,
  SubscriberFindFirstSchema,
  SubscriberFindManySchema,
  SubscriberUpdateOneSchema,
} from 'schemas/schemas';
import SubscriberAPI from 'server/api/subscribers';
import { procedure, router } from 'server/trpc';
import { zNotifyOptions, zSubscriberAnnouncement } from 'utils/validators';

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
  announce: procedure
    .input(
      z.object({
        announcement: zSubscriberAnnouncement,
        options: zNotifyOptions,
      }),
    )
    .mutation(({ input }) =>
      SubscriberAPI.announce(input.announcement, input.options),
    ),
});

export default subscriberRouter;
