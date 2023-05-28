import { z } from 'zod';
import { SubscriberSelectObjectSchema } from './objects/SubscriberSelect.schema';
import { SubscriberCreateInputObjectSchema } from './objects/SubscriberCreateInput.schema';
import { SubscriberUncheckedCreateInputObjectSchema } from './objects/SubscriberUncheckedCreateInput.schema';

export const SubscriberCreateOneSchema = z.object({
  select: SubscriberSelectObjectSchema.optional(),
  data: z.union([
    SubscriberCreateInputObjectSchema,
    SubscriberUncheckedCreateInputObjectSchema,
  ]),
});
