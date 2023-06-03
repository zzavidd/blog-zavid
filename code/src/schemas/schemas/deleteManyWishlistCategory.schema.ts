import { z } from 'zod';
import { WishlistCategoryWhereInputObjectSchema } from './objects/WishlistCategoryWhereInput.schema';

export const WishlistCategoryDeleteManySchema = z.object({
  where: WishlistCategoryWhereInputObjectSchema.optional(),
});
