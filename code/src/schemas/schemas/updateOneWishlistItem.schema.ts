import { z } from 'zod';
import { WishlistItemUpdateInputObjectSchema } from './objects/WishlistItemUpdateInput.schema';
import { WishlistItemUncheckedUpdateInputObjectSchema } from './objects/WishlistItemUncheckedUpdateInput.schema';
import { WishlistItemWhereUniqueInputObjectSchema } from './objects/WishlistItemWhereUniqueInput.schema';

export const WishlistItemUpdateOneSchema = z.object({
  data: z.union([
    WishlistItemUpdateInputObjectSchema,
    WishlistItemUncheckedUpdateInputObjectSchema,
  ]),
  where: WishlistItemWhereUniqueInputObjectSchema,
});
