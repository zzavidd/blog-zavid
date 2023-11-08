import { z } from 'zod';

import ExclusiveCreateArgsSchema from 'schemas/outputTypeSchemas/ExclusiveCreateArgsSchema';
import ExclusiveDeleteArgsSchema from 'schemas/outputTypeSchemas/ExclusiveDeleteArgsSchema';
import ExclusiveFindFirstArgsSchema from 'schemas/outputTypeSchemas/ExclusiveFindFirstArgsSchema';
import ExclusiveFindManyArgsSchema from 'schemas/outputTypeSchemas/ExclusiveFindManyArgsSchema';
import ExclusiveUpdateArgsSchema from 'schemas/outputTypeSchemas/ExclusiveUpdateArgsSchema';
import ExclusiveAPI from 'server/api/exclusives';
import { procedure, router } from 'server/trpc';
import { zNotifyOptions } from 'utils/validators';

const exclusiveRouter = router({
  find: procedure
    .input(ExclusiveFindFirstArgsSchema)
    .query(({ input }) => ExclusiveAPI.find(input)),
  findMany: procedure
    .input(ExclusiveFindManyArgsSchema)
    .query(({ input }) => ExclusiveAPI.findMany(input)),
  create: procedure
    .input(
      z.object({
        exclusive: ExclusiveCreateArgsSchema,
        isPublish: z.boolean().optional(),
      }),
    )
    .mutation(({ input }) =>
      ExclusiveAPI.create(input.exclusive, input.isPublish),
    ),
  update: procedure
    .input(
      z.object({
        exclusive: ExclusiveUpdateArgsSchema,
        isPublish: z.boolean().optional(),
      }),
    )
    .mutation(({ input }) =>
      ExclusiveAPI.update(input.exclusive, input.isPublish),
    ),
  delete: procedure
    .input(ExclusiveDeleteArgsSchema)
    .mutation(({ input }) => ExclusiveAPI.delete(input)),
  index: procedure
    .input(z.number())
    .query(({ input }) => ExclusiveAPI.index(input)),
  publish: procedure
    .input(z.object({ id: z.number(), options: zNotifyOptions }))
    .mutation(({ input }) => ExclusiveAPI.publish(input.id, input.options)),
});

export default exclusiveRouter;
