import { z } from 'zod';
import { ExclusiveWhereInputObjectSchema } from './objects/ExclusiveWhereInput.schema';

export const ExclusiveDeleteManySchema = z.object({
  where: ExclusiveWhereInputObjectSchema.optional(),
});
