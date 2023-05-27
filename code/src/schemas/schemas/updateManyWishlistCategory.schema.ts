import { z } from 'zod';
import { WishlistCategoryUpdateManyMutationInputObjectSchema } from './objects/WishlistCategoryUpdateManyMutationInput.schema';
import { WishlistCategoryWhereInputObjectSchema } from './objects/WishlistCategoryWhereInput.schema';

export const WishlistCategoryUpdateManySchema = z.object({
  data: WishlistCategoryUpdateManyMutationInputObjectSchema,
  where: WishlistCategoryWhereInputObjectSchema.optional(),
});
