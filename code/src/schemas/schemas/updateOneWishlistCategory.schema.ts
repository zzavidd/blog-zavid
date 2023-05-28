import { z } from 'zod';
import { WishlistCategorySelectObjectSchema } from './objects/WishlistCategorySelect.schema';
import { WishlistCategoryUpdateInputObjectSchema } from './objects/WishlistCategoryUpdateInput.schema';
import { WishlistCategoryUncheckedUpdateInputObjectSchema } from './objects/WishlistCategoryUncheckedUpdateInput.schema';
import { WishlistCategoryWhereUniqueInputObjectSchema } from './objects/WishlistCategoryWhereUniqueInput.schema';

export const WishlistCategoryUpdateOneSchema = z.object({
  select: WishlistCategorySelectObjectSchema.optional(),
  data: z.union([
    WishlistCategoryUpdateInputObjectSchema,
    WishlistCategoryUncheckedUpdateInputObjectSchema,
  ]),
  where: WishlistCategoryWhereUniqueInputObjectSchema,
});
