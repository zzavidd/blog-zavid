import { z } from 'zod';
import { WishlistItemWhereInputObjectSchema } from './objects/WishlistItemWhereInput.schema';

export const WishlistItemDeleteManySchema = z.object({
  where: WishlistItemWhereInputObjectSchema.optional(),
});
