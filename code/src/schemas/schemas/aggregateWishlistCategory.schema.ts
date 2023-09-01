import { z } from 'zod';
import { WishlistCategoryOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/WishlistCategoryOrderByWithRelationAndSearchRelevanceInput.schema';
import { WishlistCategoryWhereInputObjectSchema } from './objects/WishlistCategoryWhereInput.schema';
import { WishlistCategoryWhereUniqueInputObjectSchema } from './objects/WishlistCategoryWhereUniqueInput.schema';
import { WishlistCategoryCountAggregateInputObjectSchema } from './objects/WishlistCategoryCountAggregateInput.schema';
import { WishlistCategoryMinAggregateInputObjectSchema } from './objects/WishlistCategoryMinAggregateInput.schema';
import { WishlistCategoryMaxAggregateInputObjectSchema } from './objects/WishlistCategoryMaxAggregateInput.schema';
import { WishlistCategoryAvgAggregateInputObjectSchema } from './objects/WishlistCategoryAvgAggregateInput.schema';
import { WishlistCategorySumAggregateInputObjectSchema } from './objects/WishlistCategorySumAggregateInput.schema';

export const WishlistCategoryAggregateSchema = z.object({
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
  _count: z
    .union([z.literal(true), WishlistCategoryCountAggregateInputObjectSchema])
    .optional(),
  _min: WishlistCategoryMinAggregateInputObjectSchema.optional(),
  _max: WishlistCategoryMaxAggregateInputObjectSchema.optional(),
  _avg: WishlistCategoryAvgAggregateInputObjectSchema.optional(),
  _sum: WishlistCategorySumAggregateInputObjectSchema.optional(),
});
