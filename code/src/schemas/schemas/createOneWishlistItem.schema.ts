import { z } from 'zod';
import { WishlistItemCreateInputObjectSchema } from './objects/WishlistItemCreateInput.schema';
import { WishlistItemUncheckedCreateInputObjectSchema } from './objects/WishlistItemUncheckedCreateInput.schema';

export const WishlistItemCreateOneSchema = z.object({
  data: z.union([
    WishlistItemCreateInputObjectSchema,
    WishlistItemUncheckedCreateInputObjectSchema,
  ]),
});
