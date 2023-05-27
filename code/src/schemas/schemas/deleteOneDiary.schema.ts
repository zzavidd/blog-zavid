import { z } from 'zod';
import { DiaryWhereUniqueInputObjectSchema } from './objects/DiaryWhereUniqueInput.schema';

export const DiaryDeleteOneSchema = z.object({
  where: DiaryWhereUniqueInputObjectSchema,
});
