import { z } from 'zod';
import { ExclusiveOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/ExclusiveOrderByWithRelationAndSearchRelevanceInput.schema';
import { ExclusiveWhereInputObjectSchema } from './objects/ExclusiveWhereInput.schema';
import { ExclusiveWhereUniqueInputObjectSchema } from './objects/ExclusiveWhereUniqueInput.schema';
import { ExclusiveCountAggregateInputObjectSchema } from './objects/ExclusiveCountAggregateInput.schema';
import { ExclusiveMinAggregateInputObjectSchema } from './objects/ExclusiveMinAggregateInput.schema';
import { ExclusiveMaxAggregateInputObjectSchema } from './objects/ExclusiveMaxAggregateInput.schema';
import { ExclusiveAvgAggregateInputObjectSchema } from './objects/ExclusiveAvgAggregateInput.schema';
import { ExclusiveSumAggregateInputObjectSchema } from './objects/ExclusiveSumAggregateInput.schema';

export const ExclusiveAggregateSchema = z.object({
  orderBy: z
    .union([
      ExclusiveOrderByWithRelationAndSearchRelevanceInputObjectSchema,
      ExclusiveOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
    ])
    .optional(),
  where: ExclusiveWhereInputObjectSchema.optional(),
  cursor: ExclusiveWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  _count: z
    .union([z.literal(true), ExclusiveCountAggregateInputObjectSchema])
    .optional(),
  _min: ExclusiveMinAggregateInputObjectSchema.optional(),
  _max: ExclusiveMaxAggregateInputObjectSchema.optional(),
  _avg: ExclusiveAvgAggregateInputObjectSchema.optional(),
  _sum: ExclusiveSumAggregateInputObjectSchema.optional(),
});
