import { z } from 'zod';
import { SubscriberOrderByWithRelationInputObjectSchema } from './objects/SubscriberOrderByWithRelationInput.schema';
import { SubscriberWhereInputObjectSchema } from './objects/SubscriberWhereInput.schema';
import { SubscriberWhereUniqueInputObjectSchema } from './objects/SubscriberWhereUniqueInput.schema';
import { SubscriberCountAggregateInputObjectSchema } from './objects/SubscriberCountAggregateInput.schema';
import { SubscriberMinAggregateInputObjectSchema } from './objects/SubscriberMinAggregateInput.schema';
import { SubscriberMaxAggregateInputObjectSchema } from './objects/SubscriberMaxAggregateInput.schema';
import { SubscriberAvgAggregateInputObjectSchema } from './objects/SubscriberAvgAggregateInput.schema';
import { SubscriberSumAggregateInputObjectSchema } from './objects/SubscriberSumAggregateInput.schema';

export const SubscriberAggregateSchema = z.object({
  orderBy: z
    .union([
      SubscriberOrderByWithRelationInputObjectSchema,
      SubscriberOrderByWithRelationInputObjectSchema.array(),
    ])
    .optional(),
  where: SubscriberWhereInputObjectSchema.optional(),
  cursor: SubscriberWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  _count: z
    .union([z.literal(true), SubscriberCountAggregateInputObjectSchema])
    .optional(),
  _min: SubscriberMinAggregateInputObjectSchema.optional(),
  _max: SubscriberMaxAggregateInputObjectSchema.optional(),
  _avg: SubscriberAvgAggregateInputObjectSchema.optional(),
  _sum: SubscriberSumAggregateInputObjectSchema.optional(),
});
