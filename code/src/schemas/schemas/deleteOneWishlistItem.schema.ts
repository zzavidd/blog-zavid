import { z } from 'zod';
import { WishlistItemWhereUniqueInputObjectSchema } from './objects/WishlistItemWhereUniqueInput.schema';

export const WishlistItemDeleteOneSchema = z.object({
  where: WishlistItemWhereUniqueInputObjectSchema,
});
