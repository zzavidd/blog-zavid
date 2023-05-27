import { z } from 'zod';
import { SubscriberUpdateManyMutationInputObjectSchema } from './objects/SubscriberUpdateManyMutationInput.schema';
import { SubscriberWhereInputObjectSchema } from './objects/SubscriberWhereInput.schema';

export const SubscriberUpdateManySchema = z.object({
  data: SubscriberUpdateManyMutationInputObjectSchema,
  where: SubscriberWhereInputObjectSchema.optional(),
});
