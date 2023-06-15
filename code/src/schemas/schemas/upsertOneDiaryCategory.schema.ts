import { z } from 'zod';
import { DiaryCategorySelectObjectSchema } from './objects/DiaryCategorySelect.schema';
import { DiaryCategoryIncludeObjectSchema } from './objects/DiaryCategoryInclude.schema';
import { DiaryCategoryWhereUniqueInputObjectSchema } from './objects/DiaryCategoryWhereUniqueInput.schema';
import { DiaryCategoryCreateInputObjectSchema } from './objects/DiaryCategoryCreateInput.schema';
import { DiaryCategoryUncheckedCreateInputObjectSchema } from './objects/DiaryCategoryUncheckedCreateInput.schema';
import { DiaryCategoryUpdateInputObjectSchema } from './objects/DiaryCategoryUpdateInput.schema';
import { DiaryCategoryUncheckedUpdateInputObjectSchema } from './objects/DiaryCategoryUncheckedUpdateInput.schema';

export const DiaryCategoryUpsertSchema = z.object({
  select: DiaryCategorySelectObjectSchema.optional(),
  include: DiaryCategoryIncludeObjectSchema.optional(),
  where: DiaryCategoryWhereUniqueInputObjectSchema,
  create: z.union([
    DiaryCategoryCreateInputObjectSchema,
    DiaryCategoryUncheckedCreateInputObjectSchema,
  ]),
  update: z.union([
    DiaryCategoryUpdateInputObjectSchema,
    DiaryCategoryUncheckedUpdateInputObjectSchema,
  ]),
});
