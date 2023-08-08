import { z } from 'zod';
import { ExclusiveSelectObjectSchema } from './objects/ExclusiveSelect.schema';
import { ExclusiveCreateInputObjectSchema } from './objects/ExclusiveCreateInput.schema';
import { ExclusiveUncheckedCreateInputObjectSchema } from './objects/ExclusiveUncheckedCreateInput.schema';

export const ExclusiveCreateOneSchema = z.object({
  select: ExclusiveSelectObjectSchema.optional(),
  data: z.union([
    ExclusiveCreateInputObjectSchema,
    ExclusiveUncheckedCreateInputObjectSchema,
  ]),
});
