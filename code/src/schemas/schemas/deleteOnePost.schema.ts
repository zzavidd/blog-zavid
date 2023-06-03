import { z } from 'zod';
import { PostSelectObjectSchema } from './objects/PostSelect.schema';
import { PostWhereUniqueInputObjectSchema } from './objects/PostWhereUniqueInput.schema';

export const PostDeleteOneSchema = z.object({
  select: PostSelectObjectSchema.optional(),
  where: PostWhereUniqueInputObjectSchema,
});
