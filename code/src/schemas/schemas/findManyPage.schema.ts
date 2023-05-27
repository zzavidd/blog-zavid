import { z } from 'zod';
import { PageOrderByWithRelationInputObjectSchema } from './objects/PageOrderByWithRelationInput.schema';
import { PageWhereInputObjectSchema } from './objects/PageWhereInput.schema';
import { PageWhereUniqueInputObjectSchema } from './objects/PageWhereUniqueInput.schema';
import { PageScalarFieldEnumSchema } from './enums/PageScalarFieldEnum.schema';

export const PageFindManySchema = z.object({
  orderBy: z
    .union([
      PageOrderByWithRelationInputObjectSchema,
      PageOrderByWithRelationInputObjectSchema.array(),
    ])
    .optional(),
  where: PageWhereInputObjectSchema.optional(),
  cursor: PageWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.array(PageScalarFieldEnumSchema).optional(),
});
