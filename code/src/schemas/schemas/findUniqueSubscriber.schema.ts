import { z } from 'zod';
import { SubscriberWhereUniqueInputObjectSchema } from './objects/SubscriberWhereUniqueInput.schema';

export const SubscriberFindUniqueSchema = z.object({
  where: SubscriberWhereUniqueInputObjectSchema,
});
