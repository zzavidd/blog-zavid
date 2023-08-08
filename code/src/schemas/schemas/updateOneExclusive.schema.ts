import { z } from 'zod';
import { ExclusiveSelectObjectSchema } from './objects/ExclusiveSelect.schema';
import { ExclusiveUpdateInputObjectSchema } from './objects/ExclusiveUpdateInput.schema';
import { ExclusiveUncheckedUpdateInputObjectSchema } from './objects/ExclusiveUncheckedUpdateInput.schema';
import { ExclusiveWhereUniqueInputObjectSchema } from './objects/ExclusiveWhereUniqueInput.schema';

export const ExclusiveUpdateOneSchema = z.object({
  select: ExclusiveSelectObjectSchema.optional(),
  data: z.union([
    ExclusiveUpdateInputObjectSchema,
    ExclusiveUncheckedUpdateInputObjectSchema,
  ]),
  where: ExclusiveWhereUniqueInputObjectSchema,
});
