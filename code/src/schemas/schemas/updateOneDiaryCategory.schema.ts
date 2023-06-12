import { z } from 'zod';
import { DiaryCategorySelectObjectSchema } from './objects/DiaryCategorySelect.schema';
import { DiaryCategoryIncludeObjectSchema } from './objects/DiaryCategoryInclude.schema';
import { DiaryCategoryUpdateInputObjectSchema } from './objects/DiaryCategoryUpdateInput.schema';
import { DiaryCategoryUncheckedUpdateInputObjectSchema } from './objects/DiaryCategoryUncheckedUpdateInput.schema';
import { DiaryCategoryWhereUniqueInputObjectSchema } from './objects/DiaryCategoryWhereUniqueInput.schema';

export const DiaryCategoryUpdateOneSchema = z.object({
  select: DiaryCategorySelectObjectSchema.optional(),
  include: DiaryCategoryIncludeObjectSchema.optional(),
  data: z.union([
    DiaryCategoryUpdateInputObjectSchema,
    DiaryCategoryUncheckedUpdateInputObjectSchema,
  ]),
  where: DiaryCategoryWhereUniqueInputObjectSchema,
});
