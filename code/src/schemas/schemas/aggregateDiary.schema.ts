import { z } from 'zod';
import { DiaryOrderByWithRelationInputObjectSchema } from './objects/DiaryOrderByWithRelationInput.schema';
import { DiaryWhereInputObjectSchema } from './objects/DiaryWhereInput.schema';
import { DiaryWhereUniqueInputObjectSchema } from './objects/DiaryWhereUniqueInput.schema';
import { DiaryCountAggregateInputObjectSchema } from './objects/DiaryCountAggregateInput.schema';
import { DiaryMinAggregateInputObjectSchema } from './objects/DiaryMinAggregateInput.schema';
import { DiaryMaxAggregateInputObjectSchema } from './objects/DiaryMaxAggregateInput.schema';
import { DiaryAvgAggregateInputObjectSchema } from './objects/DiaryAvgAggregateInput.schema';
import { DiarySumAggregateInputObjectSchema } from './objects/DiarySumAggregateInput.schema';

export const DiaryAggregateSchema = z.object({
  orderBy: z
    .union([
      DiaryOrderByWithRelationInputObjectSchema,
      DiaryOrderByWithRelationInputObjectSchema.array(),
    ])
    .optional(),
  where: DiaryWhereInputObjectSchema.optional(),
  cursor: DiaryWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  _count: z
    .union([z.literal(true), DiaryCountAggregateInputObjectSchema])
    .optional(),
  _min: DiaryMinAggregateInputObjectSchema.optional(),
  _max: DiaryMaxAggregateInputObjectSchema.optional(),
  _avg: DiaryAvgAggregateInputObjectSchema.optional(),
  _sum: DiarySumAggregateInputObjectSchema.optional(),
});
