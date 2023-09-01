import { z } from 'zod';
import { PageSelectObjectSchema } from './objects/PageSelect.schema';
import { PageOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/PageOrderByWithRelationAndSearchRelevanceInput.schema';
import { PageWhereInputObjectSchema } from './objects/PageWhereInput.schema';
import { PageWhereUniqueInputObjectSchema } from './objects/PageWhereUniqueInput.schema';
import { PageScalarFieldEnumSchema } from './enums/PageScalarFieldEnum.schema';

export const PageFindManySchema = z.object({
  select: z.lazy(() => PageSelectObjectSchema.optional()),
  orderBy: z
    .union([
      PageOrderByWithRelationAndSearchRelevanceInputObjectSchema,
      PageOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
    ])
    .optional(),
  where: PageWhereInputObjectSchema.optional(),
  cursor: PageWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.array(PageScalarFieldEnumSchema).optional(),
});
