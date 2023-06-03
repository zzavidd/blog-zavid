import { z } from 'zod';
import { SubscriberWhereInputObjectSchema } from './objects/SubscriberWhereInput.schema';

export const SubscriberDeleteManySchema = z.object({
  where: SubscriberWhereInputObjectSchema.optional(),
});
