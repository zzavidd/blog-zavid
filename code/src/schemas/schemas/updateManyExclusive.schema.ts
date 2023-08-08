import { z } from 'zod';
import { ExclusiveUpdateManyMutationInputObjectSchema } from './objects/ExclusiveUpdateManyMutationInput.schema';
import { ExclusiveWhereInputObjectSchema } from './objects/ExclusiveWhereInput.schema';

export const ExclusiveUpdateManySchema = z.object({
  data: ExclusiveUpdateManyMutationInputObjectSchema,
  where: ExclusiveWhereInputObjectSchema.optional(),
});
