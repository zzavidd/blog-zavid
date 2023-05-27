import { z } from 'zod';
import { SubscriberWhereUniqueInputObjectSchema } from './objects/SubscriberWhereUniqueInput.schema';

export const SubscriberDeleteOneSchema = z.object({
  where: SubscriberWhereUniqueInputObjectSchema,
});
