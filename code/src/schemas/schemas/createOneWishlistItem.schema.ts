import { z } from 'zod';
import { WishlistItemSelectObjectSchema } from './objects/WishlistItemSelect.schema';
import { WishlistItemCreateInputObjectSchema } from './objects/WishlistItemCreateInput.schema';
import { WishlistItemUncheckedCreateInputObjectSchema } from './objects/WishlistItemUncheckedCreateInput.schema';

export const WishlistItemCreateOneSchema = z.object({
  select: WishlistItemSelectObjectSchema.optional(),
  data: z.union([
    WishlistItemCreateInputObjectSchema,
    WishlistItemUncheckedCreateInputObjectSchema,
  ]),
});
