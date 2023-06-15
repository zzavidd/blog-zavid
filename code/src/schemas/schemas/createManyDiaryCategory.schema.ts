import { z } from 'zod';
import { DiaryCategoryCreateManyInputObjectSchema } from './objects/DiaryCategoryCreateManyInput.schema';

export const DiaryCategoryCreateManySchema = z.object({
  data: z.union([
    DiaryCategoryCreateManyInputObjectSchema,
    z.array(DiaryCategoryCreateManyInputObjectSchema),
  ]),
  skipDuplicates: z.boolean().optional(),
});
