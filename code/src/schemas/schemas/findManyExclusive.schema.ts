import { z } from 'zod';
import { ExclusiveSelectObjectSchema } from './objects/ExclusiveSelect.schema';
import { ExclusiveOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/ExclusiveOrderByWithRelationAndSearchRelevanceInput.schema';
import { ExclusiveWhereInputObjectSchema } from './objects/ExclusiveWhereInput.schema';
import { ExclusiveWhereUniqueInputObjectSchema } from './objects/ExclusiveWhereUniqueInput.schema';
import { ExclusiveScalarFieldEnumSchema } from './enums/ExclusiveScalarFieldEnum.schema';

export const ExclusiveFindManySchema = z.object({
  select: z.lazy(() => ExclusiveSelectObjectSchema.optional()),
  orderBy: z
    .union([
      ExclusiveOrderByWithRelationAndSearchRelevanceInputObjectSchema,
      ExclusiveOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
    ])
    .optional(),
  where: ExclusiveWhereInputObjectSchema.optional(),
  cursor: ExclusiveWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.array(ExclusiveScalarFieldEnumSchema).optional(),
});
