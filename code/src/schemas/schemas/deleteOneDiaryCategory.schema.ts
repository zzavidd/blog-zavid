import { z } from 'zod';
import { DiaryCategorySelectObjectSchema } from './objects/DiaryCategorySelect.schema';
import { DiaryCategoryIncludeObjectSchema } from './objects/DiaryCategoryInclude.schema';
import { DiaryCategoryWhereUniqueInputObjectSchema } from './objects/DiaryCategoryWhereUniqueInput.schema';

export const DiaryCategoryDeleteOneSchema = z.object({
  select: DiaryCategorySelectObjectSchema.optional(),
  include: DiaryCategoryIncludeObjectSchema.optional(),
  where: DiaryCategoryWhereUniqueInputObjectSchema,
});
