import { z } from 'zod';
import { PostSelectObjectSchema } from './objects/PostSelect.schema';
import { PostOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './objects/PostOrderByWithRelationAndSearchRelevanceInput.schema';
import { PostWhereInputObjectSchema } from './objects/PostWhereInput.schema';
import { PostWhereUniqueInputObjectSchema } from './objects/PostWhereUniqueInput.schema';
import { PostScalarFieldEnumSchema } from './enums/PostScalarFieldEnum.schema';

export const PostFindManySchema = z.object({
  select: z.lazy(() => PostSelectObjectSchema.optional()),
  orderBy: z
    .union([
      PostOrderByWithRelationAndSearchRelevanceInputObjectSchema,
      PostOrderByWithRelationAndSearchRelevanceInputObjectSchema.array(),
    ])
    .optional(),
  where: PostWhereInputObjectSchema.optional(),
  cursor: PostWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.array(PostScalarFieldEnumSchema).optional(),
});
