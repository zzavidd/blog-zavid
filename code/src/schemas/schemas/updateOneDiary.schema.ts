import { z } from 'zod';
import { DiarySelectObjectSchema } from './objects/DiarySelect.schema';
import { DiaryIncludeObjectSchema } from './objects/DiaryInclude.schema';
import { DiaryUpdateInputObjectSchema } from './objects/DiaryUpdateInput.schema';
import { DiaryUncheckedUpdateInputObjectSchema } from './objects/DiaryUncheckedUpdateInput.schema';
import { DiaryWhereUniqueInputObjectSchema } from './objects/DiaryWhereUniqueInput.schema';

export const DiaryUpdateOneSchema = z.object({
  select: DiarySelectObjectSchema.optional(),
  include: DiaryIncludeObjectSchema.optional(),
  data: z.union([
    DiaryUpdateInputObjectSchema,
    DiaryUncheckedUpdateInputObjectSchema,
  ]),
  where: DiaryWhereUniqueInputObjectSchema,
});
