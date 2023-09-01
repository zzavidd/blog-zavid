import { z } from 'zod';
import { WishlistItemOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/WishlistItemOrderByWithRelationAndSearchRelevanceInput.schema';
import { WishlistItemWhereInputObjectSchema } from './objects/WishlistItemWhereInput.schema';
import { WishlistItemWhereUniqueInputObjectSchema } from './objects/WishlistItemWhereUniqueInput.schema';
import { WishlistItemCountAggregateInputObjectSchema } from './objects/WishlistItemCountAggregateInput.schema';
import { WishlistItemMinAggregateInputObjectSchema } from './objects/WishlistItemMinAggregateInput.schema';
import { WishlistItemMaxAggregateInputObjectSchema } from './objects/WishlistItemMaxAggregateInput.schema';
import { WishlistItemAvgAggregateInputObjectSchema } from './objects/WishlistItemAvgAggregateInput.schema';
import { WishlistItemSumAggregateInputObjectSchema } from './objects/WishlistItemSumAggregateInput.schema';

export const WishlistItemAggregateSchema = z.object({
  orderBy: z
    .union([
      WishlistItemOrderByWithRelationAndSearchRelevanceInputObjectSchema,
      WishlistItemOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
    ])
    .optional(),
  where: WishlistItemWhereInputObjectSchema.optional(),
  cursor: WishlistItemWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  _count: z
    .union([z.literal(true), WishlistItemCountAggregateInputObjectSchema])
    .optional(),
  _min: WishlistItemMinAggregateInputObjectSchema.optional(),
  _max: WishlistItemMaxAggregateInputObjectSchema.optional(),
  _avg: WishlistItemAvgAggregateInputObjectSchema.optional(),
  _sum: WishlistItemSumAggregateInputObjectSchema.optional(),
});
