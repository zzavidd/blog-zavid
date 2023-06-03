import { z } from 'zod';
import { WishlistItemSelectObjectSchema } from './objects/WishlistItemSelect.schema';
import { WishlistItemUpdateInputObjectSchema } from './objects/WishlistItemUpdateInput.schema';
import { WishlistItemUncheckedUpdateInputObjectSchema } from './objects/WishlistItemUncheckedUpdateInput.schema';
import { WishlistItemWhereUniqueInputObjectSchema } from './objects/WishlistItemWhereUniqueInput.schema';

export const WishlistItemUpdateOneSchema = z.object({
  select: WishlistItemSelectObjectSchema.optional(),
  data: z.union([
    WishlistItemUpdateInputObjectSchema,
    WishlistItemUncheckedUpdateInputObjectSchema,
  ]),
  where: WishlistItemWhereUniqueInputObjectSchema,
});
