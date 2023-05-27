import { z } from 'zod';
import { SubscriberUpdateInputObjectSchema } from './objects/SubscriberUpdateInput.schema';
import { SubscriberUncheckedUpdateInputObjectSchema } from './objects/SubscriberUncheckedUpdateInput.schema';
import { SubscriberWhereUniqueInputObjectSchema } from './objects/SubscriberWhereUniqueInput.schema';

export const SubscriberUpdateOneSchema = z.object({
  data: z.union([
    SubscriberUpdateInputObjectSchema,
    SubscriberUncheckedUpdateInputObjectSchema,
  ]),
  where: SubscriberWhereUniqueInputObjectSchema,
});
