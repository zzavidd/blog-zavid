import { z } from 'zod';
import { WishlistCategoryWhereUniqueInputObjectSchema } from './objects/WishlistCategoryWhereUniqueInput.schema';
import { WishlistCategoryCreateInputObjectSchema } from './objects/WishlistCategoryCreateInput.schema';
import { WishlistCategoryUncheckedCreateInputObjectSchema } from './objects/WishlistCategoryUncheckedCreateInput.schema';
import { WishlistCategoryUpdateInputObjectSchema } from './objects/WishlistCategoryUpdateInput.schema';
import { WishlistCategoryUncheckedUpdateInputObjectSchema } from './objects/WishlistCategoryUncheckedUpdateInput.schema';

export const WishlistCategoryUpsertSchema = z.object({
  where: WishlistCategoryWhereUniqueInputObjectSchema,
  create: z.union([
    WishlistCategoryCreateInputObjectSchema,
    WishlistCategoryUncheckedCreateInputObjectSchema,
  ]),
  update: z.union([
    WishlistCategoryUpdateInputObjectSchema,
    WishlistCategoryUncheckedUpdateInputObjectSchema,
  ]),
});
