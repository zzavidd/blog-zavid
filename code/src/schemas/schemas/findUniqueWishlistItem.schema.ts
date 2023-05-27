import { z } from 'zod';
import { WishlistItemWhereUniqueInputObjectSchema } from './objects/WishlistItemWhereUniqueInput.schema';

export const WishlistItemFindUniqueSchema = z.object({
  where: WishlistItemWhereUniqueInputObjectSchema,
});
