import { z } from 'zod';
import { ExclusiveWhereInputObjectSchema } from './objects/ExclusiveWhereInput.schema';
import { ExclusiveOrderByWithAggregationInputObjectSchema } from './objects/ExclusiveOrderByWithAggregationInput.schema';
import { ExclusiveScalarWhereWithAggregatesInputObjectSchema } from './objects/ExclusiveScalarWhereWithAggregatesInput.schema';
import { ExclusiveScalarFieldEnumSchema } from './enums/ExclusiveScalarFieldEnum.schema';

export const ExclusiveGroupBySchema = z.object({
  where: ExclusiveWhereInputObjectSchema.optional(),
  orderBy: z
    .union([
      ExclusiveOrderByWithAggregationInputObjectSchema,
      ExclusiveOrderByWithAggregationInputObjectSchema.array(),
    ])
    .optional(),
  having: ExclusiveScalarWhereWithAggregatesInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  by: z.array(ExclusiveScalarFieldEnumSchema),
});
