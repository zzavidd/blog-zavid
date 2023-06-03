import { z } from 'zod';
import { WishlistCategorySelectObjectSchema } from './objects/WishlistCategorySelect.schema';
import { WishlistCategoryWhereUniqueInputObjectSchema } from './objects/WishlistCategoryWhereUniqueInput.schema';

export const WishlistCategoryFindUniqueSchema = z.object({
  select: WishlistCategorySelectObjectSchema.optional(),
  where: WishlistCategoryWhereUniqueInputObjectSchema,
});
