import { z } from 'zod';
import { SubscriberCreateManyInputObjectSchema } from './objects/SubscriberCreateManyInput.schema';

export const SubscriberCreateManySchema = z.object({
  data: z.union([
    SubscriberCreateManyInputObjectSchema,
    z.array(SubscriberCreateManyInputObjectSchema),
  ]),
  skipDuplicates: z.boolean().optional(),
});
