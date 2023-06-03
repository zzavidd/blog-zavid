import { z } from 'zod';
import { SubscriberWhereInputObjectSchema } from './objects/SubscriberWhereInput.schema';
import { SubscriberOrderByWithAggregationInputObjectSchema } from './objects/SubscriberOrderByWithAggregationInput.schema';
import { SubscriberScalarWhereWithAggregatesInputObjectSchema } from './objects/SubscriberScalarWhereWithAggregatesInput.schema';
import { SubscriberScalarFieldEnumSchema } from './enums/SubscriberScalarFieldEnum.schema';

export const SubscriberGroupBySchema = z.object({
  where: SubscriberWhereInputObjectSchema.optional(),
  orderBy: z
    .union([
      SubscriberOrderByWithAggregationInputObjectSchema,
      SubscriberOrderByWithAggregationInputObjectSchema.array(),
    ])
    .optional(),
  having: SubscriberScalarWhereWithAggregatesInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  by: z.array(SubscriberScalarFieldEnumSchema),
});
