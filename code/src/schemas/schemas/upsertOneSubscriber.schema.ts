import { z } from 'zod';
import { SubscriberSelectObjectSchema } from './objects/SubscriberSelect.schema';
import { SubscriberWhereUniqueInputObjectSchema } from './objects/SubscriberWhereUniqueInput.schema';
import { SubscriberCreateInputObjectSchema } from './objects/SubscriberCreateInput.schema';
import { SubscriberUncheckedCreateInputObjectSchema } from './objects/SubscriberUncheckedCreateInput.schema';
import { SubscriberUpdateInputObjectSchema } from './objects/SubscriberUpdateInput.schema';
import { SubscriberUncheckedUpdateInputObjectSchema } from './objects/SubscriberUncheckedUpdateInput.schema';

export const SubscriberUpsertSchema = z.object({
  select: SubscriberSelectObjectSchema.optional(),
  where: SubscriberWhereUniqueInputObjectSchema,
  create: z.union([
    SubscriberCreateInputObjectSchema,
    SubscriberUncheckedCreateInputObjectSchema,
  ]),
  update: z.union([
    SubscriberUpdateInputObjectSchema,
    SubscriberUncheckedUpdateInputObjectSchema,
  ]),
});
