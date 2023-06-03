import { z } from 'zod';
import { WishlistCategoryCreateManyInputObjectSchema } from './objects/WishlistCategoryCreateManyInput.schema';

export const WishlistCategoryCreateManySchema = z.object({
  data: z.union([
    WishlistCategoryCreateManyInputObjectSchema,
    z.array(WishlistCategoryCreateManyInputObjectSchema),
  ]),
  skipDuplicates: z.boolean().optional(),
});
