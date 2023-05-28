import { z } from 'zod';
import { PageSelectObjectSchema } from './objects/PageSelect.schema';
import { PageCreateInputObjectSchema } from './objects/PageCreateInput.schema';
import { PageUncheckedCreateInputObjectSchema } from './objects/PageUncheckedCreateInput.schema';

export const PageCreateOneSchema = z.object({
  select: PageSelectObjectSchema.optional(),
  data: z.union([
    PageCreateInputObjectSchema,
    PageUncheckedCreateInputObjectSchema,
  ]),
});
