import { z } from 'zod';
import { SubscriberOrderByWithRelationInputObjectSchema } from './objects/SubscriberOrderByWithRelationInput.schema';
import { SubscriberWhereInputObjectSchema } from './objects/SubscriberWhereInput.schema';
import { SubscriberWhereUniqueInputObjectSchema } from './objects/SubscriberWhereUniqueInput.schema';
import { SubscriberScalarFieldEnumSchema } from './enums/SubscriberScalarFieldEnum.schema';

export const SubscriberFindFirstSchema = z.object({
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
