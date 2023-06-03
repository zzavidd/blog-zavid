import { z } from 'zod';
import { WishlistItemSelectObjectSchema } from './objects/WishlistItemSelect.schema';
import { WishlistItemWhereUniqueInputObjectSchema } from './objects/WishlistItemWhereUniqueInput.schema';
import { WishlistItemCreateInputObjectSchema } from './objects/WishlistItemCreateInput.schema';
import { WishlistItemUncheckedCreateInputObjectSchema } from './objects/WishlistItemUncheckedCreateInput.schema';
import { WishlistItemUpdateInputObjectSchema } from './objects/WishlistItemUpdateInput.schema';
import { WishlistItemUncheckedUpdateInputObjectSchema } from './objects/WishlistItemUncheckedUpdateInput.schema';

export const WishlistItemUpsertSchema = z.object({
  select: WishlistItemSelectObjectSchema.optional(),
  where: WishlistItemWhereUniqueInputObjectSchema,
  create: z.union([
    WishlistItemCreateInputObjectSchema,
    WishlistItemUncheckedCreateInputObjectSchema,
  ]),
  update: z.union([
    WishlistItemUpdateInputObjectSchema,
    WishlistItemUncheckedUpdateInputObjectSchema,
  ]),
});