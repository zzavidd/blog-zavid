import { z } from 'zod';
import { DiaryCategoryWhereInputObjectSchema } from './objects/DiaryCategoryWhereInput.schema';
import { DiaryCategoryOrderByWithAggregationInputObjectSchema } from './objects/DiaryCategoryOrderByWithAggregationInput.schema';
import { DiaryCategoryScalarWhereWithAggregatesInputObjectSchema } from './objects/DiaryCategoryScalarWhereWithAggregatesInput.schema';
import { DiaryCategoryScalarFieldEnumSchema } from './enums/DiaryCategoryScalarFieldEnum.schema';

export const DiaryCategoryGroupBySchema = z.object({
  where: DiaryCategoryWhereInputObjectSchema.optional(),
  orderBy: z
    .union([
      DiaryCategoryOrderByWithAggregationInputObjectSchema,
      DiaryCategoryOrderByWithAggregationInputObjectSchema.array(),
    ])
    .optional(),
  having: DiaryCategoryScalarWhereWithAggregatesInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  by: z.array(DiaryCategoryScalarFieldEnumSchema),
});
