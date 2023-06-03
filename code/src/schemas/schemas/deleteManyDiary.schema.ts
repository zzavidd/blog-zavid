import { z } from 'zod';
import { DiaryWhereInputObjectSchema } from './objects/DiaryWhereInput.schema';

export const DiaryDeleteManySchema = z.object({
  where: DiaryWhereInputObjectSchema.optional(),
});
