import { z } from 'zod';
import { WishlistItemUpdateManyMutationInputObjectSchema } from './objects/WishlistItemUpdateManyMutationInput.schema';
import { WishlistItemWhereInputObjectSchema } from './objects/WishlistItemWhereInput.schema';

export const WishlistItemUpdateManySchema = z.object({
  data: WishlistItemUpdateManyMutationInputObjectSchema,
  where: WishlistItemWhereInputObjectSchema.optional(),
});
