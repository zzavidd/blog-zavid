import { z } from 'zod';
import { ExclusiveSelectObjectSchema } from './objects/ExclusiveSelect.schema';
import { ExclusiveOrderByWithRelationInputObjectSchema } from './objects/ExclusiveOrderByWithRelationInput.schema';
import { ExclusiveWhereInputObjectSchema } from './objects/ExclusiveWhereInput.schema';
import { ExclusiveWhereUniqueInputObjectSchema } from './objects/ExclusiveWhereUniqueInput.schema';
import { ExclusiveScalarFieldEnumSchema } from './enums/ExclusiveScalarFieldEnum.schema';

export const ExclusiveFindFirstSchema = z.object({
  select: ExclusiveSelectObjectSchema.optional(),
  orderBy: z
    .union([
      ExclusiveOrderByWithRelationInputObjectSchema,
      ExclusiveOrderByWithRelationInputObjectSchema.array(),
    ])
    .optional(),
  where: ExclusiveWhereInputObjectSchema.optional(),
  cursor: ExclusiveWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.array(ExclusiveScalarFieldEnumSchema).optional(),
});
