import { z } from 'zod';
import { WishlistCategoryWhereUniqueInputObjectSchema } from './objects/WishlistCategoryWhereUniqueInput.schema';

export const WishlistCategoryDeleteOneSchema = z.object({
  where: WishlistCategoryWhereUniqueInputObjectSchema,
});
