import { z } from 'zod';
import { SubscriberSelectObjectSchema } from './objects/SubscriberSelect.schema';
import { SubscriberWhereUniqueInputObjectSchema } from './objects/SubscriberWhereUniqueInput.schema';

export const SubscriberFindUniqueSchema = z.object({
  select: SubscriberSelectObjectSchema.optional(),
  where: SubscriberWhereUniqueInputObjectSchema,
});