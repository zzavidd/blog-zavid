import { z } from 'zod';
import { DiarySelectObjectSchema } from './objects/DiarySelect.schema';
import { DiaryUpdateInputObjectSchema } from './objects/DiaryUpdateInput.schema';
import { DiaryUncheckedUpdateInputObjectSchema } from './objects/DiaryUncheckedUpdateInput.schema';
import { DiaryWhereUniqueInputObjectSchema } from './objects/DiaryWhereUniqueInput.schema';

export const DiaryUpdateOneSchema = z.object({
  select: DiarySelectObjectSchema.optional(),
  data: z.union([
    DiaryUpdateInputObjectSchema,
    DiaryUncheckedUpdateInputObjectSchema,
  ]),
  where: DiaryWhereUniqueInputObjectSchema,
});
