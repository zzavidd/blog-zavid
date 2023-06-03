import { z } from 'zod';
import { SubscriberSelectObjectSchema } from './objects/SubscriberSelect.schema';
import { SubscriberUpdateInputObjectSchema } from './objects/SubscriberUpdateInput.schema';
import { SubscriberUncheckedUpdateInputObjectSchema } from './objects/SubscriberUncheckedUpdateInput.schema';
import { SubscriberWhereUniqueInputObjectSchema } from './objects/SubscriberWhereUniqueInput.schema';

export const SubscriberUpdateOneSchema = z.object({
  select: SubscriberSelectObjectSchema.optional(),
  data: z.union([
    SubscriberUpdateInputObjectSchema,
    SubscriberUncheckedUpdateInputObjectSchema,
  ]),
  where: SubscriberWhereUniqueInputObjectSchema,
});
