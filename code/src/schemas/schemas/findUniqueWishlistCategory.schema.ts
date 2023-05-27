import { z } from 'zod';
import { WishlistCategoryWhereUniqueInputObjectSchema } from './objects/WishlistCategoryWhereUniqueInput.schema';

export const WishlistCategoryFindUniqueSchema = z.object({
  where: WishlistCategoryWhereUniqueInputObjectSchema,
});
