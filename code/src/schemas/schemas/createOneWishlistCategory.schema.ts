import { z } from 'zod';
import { WishlistCategorySelectObjectSchema } from './objects/WishlistCategorySelect.schema';
import { WishlistCategoryIncludeObjectSchema } from './objects/WishlistCategoryInclude.schema';
import { WishlistCategoryCreateInputObjectSchema } from './objects/WishlistCategoryCreateInput.schema';
import { WishlistCategoryUncheckedCreateInputObjectSchema } from './objects/WishlistCategoryUncheckedCreateInput.schema';

export const WishlistCategoryCreateOneSchema = z.object({
  select: WishlistCategorySelectObjectSchema.optional(),
  include: WishlistCategoryIncludeObjectSchema.optional(),
  data: z.union([
    WishlistCategoryCreateInputObjectSchema,
    WishlistCategoryUncheckedCreateInputObjectSchema,
  ]),
});
