import { z } from 'zod';
import { WishlistCategoryOrderByWithRelationInputObjectSchema } from './objects/WishlistCategoryOrderByWithRelationInput.schema';
import { WishlistCategoryWhereInputObjectSchema } from './objects/WishlistCategoryWhereInput.schema';
import { WishlistCategoryWhereUniqueInputObjectSchema } from './objects/WishlistCategoryWhereUniqueInput.schema';
import { WishlistCategoryScalarFieldEnumSchema } from './enums/WishlistCategoryScalarFieldEnum.schema';

export const WishlistCategoryFindManySchema = z.object({
  orderBy: z
    .union([
      WishlistCategoryOrderByWithRelationInputObjectSchema,
      WishlistCategoryOrderByWithRelationInputObjectSchema.array(),
    ])
    .optional(),
  where: WishlistCategoryWhereInputObjectSchema.optional(),
  cursor: WishlistCategoryWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.array(WishlistCategoryScalarFieldEnumSchema).optional(),
});
