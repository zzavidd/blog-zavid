import { z } from 'zod';
import { DiaryWhereUniqueInputObjectSchema } from './objects/DiaryWhereUniqueInput.schema';

export const DiaryFindUniqueSchema = z.object({
  where: DiaryWhereUniqueInputObjectSchema,
});
