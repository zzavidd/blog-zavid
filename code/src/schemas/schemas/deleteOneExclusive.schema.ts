import { z } from 'zod';
import { ExclusiveSelectObjectSchema } from './objects/ExclusiveSelect.schema';
import { ExclusiveWhereUniqueInputObjectSchema } from './objects/ExclusiveWhereUniqueInput.schema';

export const ExclusiveDeleteOneSchema = z.object({
  select: ExclusiveSelectObjectSchema.optional(),
  where: ExclusiveWhereUniqueInputObjectSchema,
});
