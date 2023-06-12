import { z } from 'zod';
import { DiaryCategoryOrderByWithRelationInputObjectSchema } from './objects/DiaryCategoryOrderByWithRelationInput.schema';
import { DiaryCategoryWhereInputObjectSchema } from './objects/DiaryCategoryWhereInput.schema';
import { DiaryCategoryWhereUniqueInputObjectSchema } from './objects/DiaryCategoryWhereUniqueInput.schema';
import { DiaryCategoryCountAggregateInputObjectSchema } from './objects/DiaryCategoryCountAggregateInput.schema';
import { DiaryCategoryMinAggregateInputObjectSchema } from './objects/DiaryCategoryMinAggregateInput.schema';
import { DiaryCategoryMaxAggregateInputObjectSchema } from './objects/DiaryCategoryMaxAggregateInput.schema';
import { DiaryCategoryAvgAggregateInputObjectSchema } from './objects/DiaryCategoryAvgAggregateInput.schema';
import { DiaryCategorySumAggregateInputObjectSchema } from './objects/DiaryCategorySumAggregateInput.schema';

export const DiaryCategoryAggregateSchema = z.object({
  orderBy: z
    .union([
      DiaryCategoryOrderByWithRelationInputObjectSchema,
      DiaryCategoryOrderByWithRelationInputObjectSchema.array(),
    ])
    .optional(),
  where: DiaryCategoryWhereInputObjectSchema.optional(),
  cursor: DiaryCategoryWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  _count: z
    .union([z.literal(true), DiaryCategoryCountAggregateInputObjectSchema])
    .optional(),
  _min: DiaryCategoryMinAggregateInputObjectSchema.optional(),
  _max: DiaryCategoryMaxAggregateInputObjectSchema.optional(),
  _avg: DiaryCategoryAvgAggregateInputObjectSchema.optional(),
  _sum: DiaryCategorySumAggregateInputObjectSchema.optional(),
});
