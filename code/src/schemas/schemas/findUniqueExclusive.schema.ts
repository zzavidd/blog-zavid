import { z } from 'zod';
import { ExclusiveSelectObjectSchema } from './objects/ExclusiveSelect.schema';
import { ExclusiveWhereUniqueInputObjectSchema } from './objects/ExclusiveWhereUniqueInput.schema';

export const ExclusiveFindUniqueSchema = z.object({
  select: ExclusiveSelectObjectSchema.optional(),
  where: ExclusiveWhereUniqueInputObjectSchema,
});
