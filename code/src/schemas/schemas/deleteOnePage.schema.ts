import { z } from 'zod';
import { PageWhereUniqueInputObjectSchema } from './objects/PageWhereUniqueInput.schema';

export const PageDeleteOneSchema = z.object({
  where: PageWhereUniqueInputObjectSchema,
});
