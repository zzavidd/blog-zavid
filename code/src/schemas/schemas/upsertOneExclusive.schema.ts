import { z } from 'zod';
import { ExclusiveSelectObjectSchema } from './objects/ExclusiveSelect.schema';
import { ExclusiveWhereUniqueInputObjectSchema } from './objects/ExclusiveWhereUniqueInput.schema';
import { ExclusiveCreateInputObjectSchema } from './objects/ExclusiveCreateInput.schema';
import { ExclusiveUncheckedCreateInputObjectSchema } from './objects/ExclusiveUncheckedCreateInput.schema';
import { ExclusiveUpdateInputObjectSchema } from './objects/ExclusiveUpdateInput.schema';
import { ExclusiveUncheckedUpdateInputObjectSchema } from './objects/ExclusiveUncheckedUpdateInput.schema';

export const ExclusiveUpsertSchema = z.object({
  select: ExclusiveSelectObjectSchema.optional(),
  where: ExclusiveWhereUniqueInputObjectSchema,
  create: z.union([
    ExclusiveCreateInputObjectSchema,
    ExclusiveUncheckedCreateInputObjectSchema,
  ]),
  update: z.union([
    ExclusiveUpdateInputObjectSchema,
    ExclusiveUncheckedUpdateInputObjectSchema,
  ]),
});
