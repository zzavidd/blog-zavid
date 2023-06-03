import { z } from 'zod';
import { PageSelectObjectSchema } from './objects/PageSelect.schema';
import { PageUpdateInputObjectSchema } from './objects/PageUpdateInput.schema';
import { PageUncheckedUpdateInputObjectSchema } from './objects/PageUncheckedUpdateInput.schema';
import { PageWhereUniqueInputObjectSchema } from './objects/PageWhereUniqueInput.schema';

export const PageUpdateOneSchema = z.object({
  select: PageSelectObjectSchema.optional(),
  data: z.union([
    PageUpdateInputObjectSchema,
    PageUncheckedUpdateInputObjectSchema,
  ]),
  where: PageWhereUniqueInputObjectSchema,
});
