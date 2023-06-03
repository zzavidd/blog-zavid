import { z } from 'zod';
import { DiarySelectObjectSchema } from './objects/DiarySelect.schema';
import { DiaryWhereUniqueInputObjectSchema } from './objects/DiaryWhereUniqueInput.schema';

export const DiaryFindUniqueSchema = z.object({
  select: DiarySelectObjectSchema.optional(),
  where: DiaryWhereUniqueInputObjectSchema,
});
