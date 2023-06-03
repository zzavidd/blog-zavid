import { z } from 'zod';
import { SubscriberSelectObjectSchema } from './objects/SubscriberSelect.schema';
import { SubscriberOrderByWithRelationInputObjectSchema } from './objects/SubscriberOrderByWithRelationInput.schema';
import { SubscriberWhereInputObjectSchema } from './objects/SubscriberWhereInput.schema';
import { SubscriberWhereUniqueInputObjectSchema } from './objects/SubscriberWhereUniqueInput.schema';
import { SubscriberScalarFieldEnumSchema } from './enums/SubscriberScalarFieldEnum.schema';

export const SubscriberFindManySchema = z.object({
  select: z.lazy(() => SubscriberSelectObjectSchema.optional()),
  orderBy: z
    .union([
      SubscriberOrderByWithRelationInputObjectSchema,
      SubscriberOrderByWithRelationInputObjectSchema.array(),
    ])
    .optional(),
  where: SubscriberWhereInputObjectSchema.optional(),
  cursor: SubscriberWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.array(SubscriberScalarFieldEnumSchema).optional(),
});