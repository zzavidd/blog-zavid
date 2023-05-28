import { z } from 'zod';
import { PageSelectObjectSchema } from './objects/PageSelect.schema';
import { PageWhereUniqueInputObjectSchema } from './objects/PageWhereUniqueInput.schema';

export const PageDeleteOneSchema = z.object({
  select: PageSelectObjectSchema.optional(),
  where: PageWhereUniqueInputObjectSchema,
});
