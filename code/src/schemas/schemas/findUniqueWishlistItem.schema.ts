import { z } from 'zod';
import { WishlistItemSelectObjectSchema } from './objects/WishlistItemSelect.schema';
import { WishlistItemIncludeObjectSchema } from './objects/WishlistItemInclude.schema';
import { WishlistItemWhereUniqueInputObjectSchema } from './objects/WishlistItemWhereUniqueInput.schema';

export const WishlistItemFindUniqueSchema = z.object({
  select: WishlistItemSelectObjectSchema.optional(),
  include: WishlistItemIncludeObjectSchema.optional(),
  where: WishlistItemWhereUniqueInputObjectSchema,
});
