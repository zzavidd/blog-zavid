import { z } from 'zod';
import { DiaryCreateInputObjectSchema } from './objects/DiaryCreateInput.schema';
import { DiaryUncheckedCreateInputObjectSchema } from './objects/DiaryUncheckedCreateInput.schema';

export const DiaryCreateOneSchema = z.object({
  data: z.union([
    DiaryCreateInputObjectSchema,
    DiaryUncheckedCreateInputObjectSchema,
  ]),
});
