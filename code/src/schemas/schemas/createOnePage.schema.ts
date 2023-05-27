import { z } from 'zod';
import { PageCreateInputObjectSchema } from './objects/PageCreateInput.schema';
import { PageUncheckedCreateInputObjectSchema } from './objects/PageUncheckedCreateInput.schema';

export const PageCreateOneSchema = z.object({
  data: z.union([
    PageCreateInputObjectSchema,
    PageUncheckedCreateInputObjectSchema,
  ]),
});
