import { z } from 'zod';
import { DiaryCreateManyInputObjectSchema } from './objects/DiaryCreateManyInput.schema';

export const DiaryCreateManySchema = z.object({
  data: z.union([
    DiaryCreateManyInputObjectSchema,
    z.array(DiaryCreateManyInputObjectSchema),
  ]),
  skipDuplicates: z.boolean().optional(),
});
