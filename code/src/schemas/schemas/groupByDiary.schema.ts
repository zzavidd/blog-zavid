import { z } from 'zod';
import { DiaryWhereInputObjectSchema } from './objects/DiaryWhereInput.schema';
import { DiaryOrderByWithAggregationInputObjectSchema } from './objects/DiaryOrderByWithAggregationInput.schema';
import { DiaryScalarWhereWithAggregatesInputObjectSchema } from './objects/DiaryScalarWhereWithAggregatesInput.schema';
import { DiaryScalarFieldEnumSchema } from './enums/DiaryScalarFieldEnum.schema';

export const DiaryGroupBySchema = z.object({
  where: DiaryWhereInputObjectSchema.optional(),
  orderBy: z
    .union([
      DiaryOrderByWithAggregationInputObjectSchema,
      DiaryOrderByWithAggregationInputObjectSchema.array(),
    ])
    .optional(),
  having: DiaryScalarWhereWithAggregatesInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  by: z.array(DiaryScalarFieldEnumSchema),
});
