import { z } from 'zod';
import { DiaryCategorySelectObjectSchema } from './objects/DiaryCategorySelect.schema';
import { DiaryCategoryIncludeObjectSchema } from './objects/DiaryCategoryInclude.schema';
import { DiaryCategoryOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/DiaryCategoryOrderByWithRelationAndSearchRelevanceInput.schema';
import { DiaryCategoryWhereInputObjectSchema } from './objects/DiaryCategoryWhereInput.schema';
import { DiaryCategoryWhereUniqueInputObjectSchema } from './objects/DiaryCategoryWhereUniqueInput.schema';
import { DiaryCategoryScalarFieldEnumSchema } from './enums/DiaryCategoryScalarFieldEnum.schema';

export const DiaryCategoryFindFirstSchema = z.object({
  select: DiaryCategorySelectObjectSchema.optional(),
  include: DiaryCategoryIncludeObjectSchema.optional(),
  orderBy: z
    .union([
      DiaryCategoryOrderByWithRelationAndSearchRelevanceInputObjectSchema,
      DiaryCategoryOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
    ])
    .optional(),
  where: DiaryCategoryWhereInputObjectSchema.optional(),
  cursor: DiaryCategoryWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.array(DiaryCategoryScalarFieldEnumSchema).optional(),
});
