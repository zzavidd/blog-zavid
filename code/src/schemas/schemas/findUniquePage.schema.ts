import { z } from 'zod';
import { PageWhereUniqueInputObjectSchema } from './objects/PageWhereUniqueInput.schema';

export const PageFindUniqueSchema = z.object({
  where: PageWhereUniqueInputObjectSchema,
});
