import { z } from 'zod';
import { DiarySelectObjectSchema } from './objects/DiarySelect.schema';
import { DiaryCreateInputObjectSchema } from './objects/DiaryCreateInput.schema';
import { DiaryUncheckedCreateInputObjectSchema } from './objects/DiaryUncheckedCreateInput.schema';

export const DiaryCreateOneSchema = z.object({
  select: DiarySelectObjectSchema.optional(),
  data: z.union([
    DiaryCreateInputObjectSchema,
    DiaryUncheckedCreateInputObjectSchema,
  ]),
});
