import { z } from 'zod';
import { DiaryCategorySelectObjectSchema } from './objects/DiaryCategorySelect.schema';
import { DiaryCategoryIncludeObjectSchema } from './objects/DiaryCategoryInclude.schema';
import { DiaryCategoryCreateInputObjectSchema } from './objects/DiaryCategoryCreateInput.schema';
import { DiaryCategoryUncheckedCreateInputObjectSchema } from './objects/DiaryCategoryUncheckedCreateInput.schema';

export const DiaryCategoryCreateOneSchema = z.object({
  select: DiaryCategorySelectObjectSchema.optional(),
  include: DiaryCategoryIncludeObjectSchema.optional(),
  data: z.union([
    DiaryCategoryCreateInputObjectSchema,
    DiaryCategoryUncheckedCreateInputObjectSchema,
  ]),
});
