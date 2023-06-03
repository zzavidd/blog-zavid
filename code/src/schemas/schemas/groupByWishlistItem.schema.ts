import { z } from 'zod';
import { WishlistItemWhereInputObjectSchema } from './objects/WishlistItemWhereInput.schema';
import { WishlistItemOrderByWithAggregationInputObjectSchema } from './objects/WishlistItemOrderByWithAggregationInput.schema';
import { WishlistItemScalarWhereWithAggregatesInputObjectSchema } from './objects/WishlistItemScalarWhereWithAggregatesInput.schema';
import { WishlistItemScalarFieldEnumSchema } from './enums/WishlistItemScalarFieldEnum.schema';

export const WishlistItemGroupBySchema = z.object({
  where: WishlistItemWhereInputObjectSchema.optional(),
  orderBy: z
    .union([
      WishlistItemOrderByWithAggregationInputObjectSchema,
      WishlistItemOrderByWithAggregationInputObjectSchema.array(),
    ])
    .optional(),
  having: WishlistItemScalarWhereWithAggregatesInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  by: z.array(WishlistItemScalarFieldEnumSchema),
});
