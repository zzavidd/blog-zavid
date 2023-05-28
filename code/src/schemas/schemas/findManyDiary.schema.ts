import { z } from 'zod';
import { DiarySelectObjectSchema } from './objects/DiarySelect.schema';
import { DiaryOrderByWithRelationInputObjectSchema } from './objects/DiaryOrderByWithRelationInput.schema';
import { DiaryWhereInputObjectSchema } from './objects/DiaryWhereInput.schema';
import { DiaryWhereUniqueInputObjectSchema } from './objects/DiaryWhereUniqueInput.schema';
import { DiaryScalarFieldEnumSchema } from './enums/DiaryScalarFieldEnum.schema';

export const DiaryFindManySchema = z.object({
  select: z.lazy(() => DiarySelectObjectSchema.optional()),
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
  distinct: z.array(DiaryScalarFieldEnumSchema).optional(),
});
