import { z } from 'zod';
import { WishlistCategoryUpdateInputObjectSchema } from './objects/WishlistCategoryUpdateInput.schema';
import { WishlistCategoryUncheckedUpdateInputObjectSchema } from './objects/WishlistCategoryUncheckedUpdateInput.schema';
import { WishlistCategoryWhereUniqueInputObjectSchema } from './objects/WishlistCategoryWhereUniqueInput.schema';

export const WishlistCategoryUpdateOneSchema = z.object({
  data: z.union([
    WishlistCategoryUpdateInputObjectSchema,
    WishlistCategoryUncheckedUpdateInputObjectSchema,
  ]),
  where: WishlistCategoryWhereUniqueInputObjectSchema,
});
