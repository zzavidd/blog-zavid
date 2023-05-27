import { z } from 'zod';
import { WishlistCategoryCreateInputObjectSchema } from './objects/WishlistCategoryCreateInput.schema';
import { WishlistCategoryUncheckedCreateInputObjectSchema } from './objects/WishlistCategoryUncheckedCreateInput.schema';

export const WishlistCategoryCreateOneSchema = z.object({
  data: z.union([
    WishlistCategoryCreateInputObjectSchema,
    WishlistCategoryUncheckedCreateInputObjectSchema,
  ]),
});
