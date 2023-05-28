import { z } from 'zod';
import { PageSelectObjectSchema } from './objects/PageSelect.schema';
import { PageWhereUniqueInputObjectSchema } from './objects/PageWhereUniqueInput.schema';

export const PageFindUniqueSchema = z.object({
  select: PageSelectObjectSchema.optional(),
  where: PageWhereUniqueInputObjectSchema,
});
