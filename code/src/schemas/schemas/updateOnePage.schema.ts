import { z } from 'zod';
import { PageUpdateInputObjectSchema } from './objects/PageUpdateInput.schema';
import { PageUncheckedUpdateInputObjectSchema } from './objects/PageUncheckedUpdateInput.schema';
import { PageWhereUniqueInputObjectSchema } from './objects/PageWhereUniqueInput.schema';

export const PageUpdateOneSchema = z.object({
  data: z.union([
    PageUpdateInputObjectSchema,
    PageUncheckedUpdateInputObjectSchema,
  ]),
  where: PageWhereUniqueInputObjectSchema,
});
