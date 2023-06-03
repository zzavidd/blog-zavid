import { z } from 'zod';
import { WishlistItemSelectObjectSchema } from './objects/WishlistItemSelect.schema';
import { WishlistItemWhereUniqueInputObjectSchema } from './objects/WishlistItemWhereUniqueInput.schema';

export const WishlistItemDeleteOneSchema = z.object({
  select: WishlistItemSelectObjectSchema.optional(),
  where: WishlistItemWhereUniqueInputObjectSchema,
});
