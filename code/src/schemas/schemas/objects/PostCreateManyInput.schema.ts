import { z } from 'zod';
import { PostStatusSchema } from '../enums/PostStatus.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.PostCreateManyInput> = z
  .object({
    id: z.number().optional(),
    title: z.string(),
    datePublished: z.coerce.date().optional().nullable(),
    content: z.string(),
    image: z.string().optional().nullable(),
    contentImages: z.string().optional().nullable(),
    status: z.lazy(() => PostStatusSchema),
    slug: z.string().optional().nullable(),
    excerpt: z.string(),
    type: z.string().optional().nullable(),
    typeId: z.number().optional().nullable(),
    createTime: z.coerce.date().optional().nullable(),
    domainId: z.number().optional().nullable(),
  })
  .strict();

export const PostCreateManyInputObjectSchema = Schema;
