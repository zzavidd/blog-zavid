import { z } from 'zod';
import { PostSelectObjectSchema } from './objects/PostSelect.schema';
import { PostUpdateInputObjectSchema } from './objects/PostUpdateInput.schema';
import { PostUncheckedUpdateInputObjectSchema } from './objects/PostUncheckedUpdateInput.schema';
import { PostWhereUniqueInputObjectSchema } from './objects/PostWhereUniqueInput.schema';

export const PostUpdateOneSchema = z.object({
  select: PostSelectObjectSchema.optional(),
  data: z.union([
    PostUpdateInputObjectSchema,
    PostUncheckedUpdateInputObjectSchema,
  ]),
  where: PostWhereUniqueInputObjectSchema,
});
