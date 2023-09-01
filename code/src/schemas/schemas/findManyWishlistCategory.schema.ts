import { z } from 'zod';
import { WishlistCategorySelectObjectSchema } from './objects/WishlistCategorySelect.schema';
import { WishlistCategoryIncludeObjectSchema } from './objects/WishlistCategoryInclude.schema';
import { WishlistCategoryOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/WishlistCategoryOrderByWithRelationAndSearchRelevanceInput.schema';
import { WishlistCategoryWhereInputObjectSchema } from './objects/WishlistCategoryWhereInput.schema';
import { WishlistCategoryWhereUniqueInputObjectSchema } from './objects/WishlistCategoryWhereUniqueInput.schema';
import { WishlistCategoryScalarFieldEnumSchema } from './enums/WishlistCategoryScalarFieldEnum.schema';

export const WishlistCategoryFindManySchema = z.object({
  select: z.lazy(() => WishlistCategorySelectObjectSchema.optional()),
  include: z.lazy(() => WishlistCategoryIncludeObjectSchema.optional()),
  orderBy: z
    .union([
      WishlistCategoryOrderByWithRelationAndSearchRelevanceInputObjectSchema,
      WishlistCategoryOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
    ])
    .optional(),
  where: WishlistCategoryWhereInputObjectSchema.optional(),
  cursor: WishlistCategoryWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.array(WishlistCategoryScalarFieldEnumSchema).optional(),
});
