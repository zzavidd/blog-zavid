import { z } from 'zod';
import { DiaryUpdateManyMutationInputObjectSchema } from './objects/DiaryUpdateManyMutationInput.schema';
import { DiaryWhereInputObjectSchema } from './objects/DiaryWhereInput.schema';

export const DiaryUpdateManySchema = z.object({
  data: DiaryUpdateManyMutationInputObjectSchema,
  where: DiaryWhereInputObjectSchema.optional(),
});
