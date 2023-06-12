import { z } from 'zod';
import { WishlistCategorySelectObjectSchema } from './objects/WishlistCategorySelect.schema';
import { WishlistCategoryIncludeObjectSchema } from './objects/WishlistCategoryInclude.schema';
import { WishlistCategoryOrderByWithRelationInputObjectSchema } from './objects/WishlistCategoryOrderByWithRelationInput.schema';
import { WishlistCategoryWhereInputObjectSchema } from './objects/WishlistCategoryWhereInput.schema';
import { WishlistCategoryWhereUniqueInputObjectSchema } from './objects/WishlistCategoryWhereUniqueInput.schema';
import { WishlistCategoryScalarFieldEnumSchema } from './enums/WishlistCategoryScalarFieldEnum.schema';

export const WishlistCategoryFindFirstSchema = z.object({
  select: WishlistCategorySelectObjectSchema.optional(),
  include: WishlistCategoryIncludeObjectSchema.optional(),
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
