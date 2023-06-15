import { z } from 'zod';
import { DiaryCategoryUpdateManyMutationInputObjectSchema } from './objects/DiaryCategoryUpdateManyMutationInput.schema';
import { DiaryCategoryWhereInputObjectSchema } from './objects/DiaryCategoryWhereInput.schema';

export const DiaryCategoryUpdateManySchema = z.object({
  data: DiaryCategoryUpdateManyMutationInputObjectSchema,
  where: DiaryCategoryWhereInputObjectSchema.optional(),
});
