import { z } from 'zod';
import { WishlistCategorySelectObjectSchema } from './objects/WishlistCategorySelect.schema';
import { WishlistCategoryIncludeObjectSchema } from './objects/WishlistCategoryInclude.schema';
import { WishlistCategoryWhereUniqueInputObjectSchema } from './objects/WishlistCategoryWhereUniqueInput.schema';
import { WishlistCategoryCreateInputObjectSchema } from './objects/WishlistCategoryCreateInput.schema';
import { WishlistCategoryUncheckedCreateInputObjectSchema } from './objects/WishlistCategoryUncheckedCreateInput.schema';
import { WishlistCategoryUpdateInputObjectSchema } from './objects/WishlistCategoryUpdateInput.schema';
import { WishlistCategoryUncheckedUpdateInputObjectSchema } from './objects/WishlistCategoryUncheckedUpdateInput.schema';

export const WishlistCategoryUpsertSchema = z.object({
  select: WishlistCategorySelectObjectSchema.optional(),
  include: WishlistCategoryIncludeObjectSchema.optional(),
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
