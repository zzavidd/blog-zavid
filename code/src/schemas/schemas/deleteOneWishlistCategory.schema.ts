import { z } from 'zod';
import { WishlistCategorySelectObjectSchema } from './objects/WishlistCategorySelect.schema';
import { WishlistCategoryIncludeObjectSchema } from './objects/WishlistCategoryInclude.schema';
import { WishlistCategoryWhereUniqueInputObjectSchema } from './objects/WishlistCategoryWhereUniqueInput.schema';

export const WishlistCategoryDeleteOneSchema = z.object({
  select: WishlistCategorySelectObjectSchema.optional(),
  include: WishlistCategoryIncludeObjectSchema.optional(),
  where: WishlistCategoryWhereUniqueInputObjectSchema,
});
