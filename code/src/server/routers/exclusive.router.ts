import { z } from 'zod';

import {
  ExclusiveCreateOneSchema,
  ExclusiveDeleteOneSchema,
  ExclusiveFindFirstSchema,
  ExclusiveFindManySchema,
  ExclusiveUpdateOneSchema,
} from 'schemas/schemas';
import ExclusiveAPI from 'server/api/exclusives';
import { procedure, router } from 'server/trpc';
import { zEmailPreviewType } from 'utils/validators';

const exclusiveRouter = router({
  find: procedure
    .input(ExclusiveFindFirstSchema)
    .query(({ input }) => ExclusiveAPI.find(input)),
  findMany: procedure
    .input(ExclusiveFindManySchema)
    .query(({ input }) => ExclusiveAPI.findMany(input)),
  create: procedure
    .input(
      z.object({
        exclusive: ExclusiveCreateOneSchema,
        isPublish: z.boolean().optional(),
      }),
    )
    .mutation(({ input }) =>
      ExclusiveAPI.create(input.exclusive, input.isPublish),
    ),
  update: procedure
    .input(
      z.object({
        exclusive: ExclusiveUpdateOneSchema,
        isPublish: z.boolean().optional(),
      }),
    )
    .mutation(({ input }) =>
      ExclusiveAPI.update(input.exclusive, input.isPublish),
    ),
  delete: procedure
    .input(ExclusiveDeleteOneSchema)
    .mutation(({ input }) => ExclusiveAPI.delete(input)),
  index: procedure
    .input(z.number())
    .query(({ input }) => ExclusiveAPI.index(input)),
  publish: procedure
    .input(z.object({ id: z.number(), type: zEmailPreviewType }))
    .mutation(({ input }) => ExclusiveAPI.publish(input.id, input.type)),
});

export default exclusiveRouter;
