import { z } from 'zod';
import { DiaryCategoryWhereInputObjectSchema } from './objects/DiaryCategoryWhereInput.schema';

export const DiaryCategoryDeleteManySchema = z.object({
  where: DiaryCategoryWhereInputObjectSchema.optional(),
});
