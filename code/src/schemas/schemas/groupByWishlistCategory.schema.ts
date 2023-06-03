import { z } from 'zod';
import { WishlistCategoryWhereInputObjectSchema } from './objects/WishlistCategoryWhereInput.schema';
import { WishlistCategoryOrderByWithAggregationInputObjectSchema } from './objects/WishlistCategoryOrderByWithAggregationInput.schema';
import { WishlistCategoryScalarWhereWithAggregatesInputObjectSchema } from './objects/WishlistCategoryScalarWhereWithAggregatesInput.schema';
import { WishlistCategoryScalarFieldEnumSchema } from './enums/WishlistCategoryScalarFieldEnum.schema';

export const WishlistCategoryGroupBySchema = z.object({
  where: WishlistCategoryWhereInputObjectSchema.optional(),
  orderBy: z
    .union([
      WishlistCategoryOrderByWithAggregationInputObjectSchema,
      WishlistCategoryOrderByWithAggregationInputObjectSchema.array(),
    ])
    .optional(),
  having: WishlistCategoryScalarWhereWithAggregatesInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  by: z.array(WishlistCategoryScalarFieldEnumSchema),
});
