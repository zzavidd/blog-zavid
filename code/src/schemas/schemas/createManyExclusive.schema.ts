import { z } from 'zod';
import { ExclusiveCreateManyInputObjectSchema } from './objects/ExclusiveCreateManyInput.schema';

export const ExclusiveCreateManySchema = z.object({
  data: z.union([
    ExclusiveCreateManyInputObjectSchema,
    z.array(ExclusiveCreateManyInputObjectSchema),
  ]),
  skipDuplicates: z.boolean().optional(),
});
