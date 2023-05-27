import { z } from 'zod';
import { DiaryUpdateInputObjectSchema } from './objects/DiaryUpdateInput.schema';
import { DiaryUncheckedUpdateInputObjectSchema } from './objects/DiaryUncheckedUpdateInput.schema';
import { DiaryWhereUniqueInputObjectSchema } from './objects/DiaryWhereUniqueInput.schema';

export const DiaryUpdateOneSchema = z.object({
  data: z.union([
    DiaryUpdateInputObjectSchema,
    DiaryUncheckedUpdateInputObjectSchema,
  ]),
  where: DiaryWhereUniqueInputObjectSchema,
});
