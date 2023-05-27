import { z } from 'zod';
import { SubscriberCreateInputObjectSchema } from './objects/SubscriberCreateInput.schema';
import { SubscriberUncheckedCreateInputObjectSchema } from './objects/SubscriberUncheckedCreateInput.schema';

export const SubscriberCreateOneSchema = z.object({
  data: z.union([
    SubscriberCreateInputObjectSchema,
    SubscriberUncheckedCreateInputObjectSchema,
  ]),
});
