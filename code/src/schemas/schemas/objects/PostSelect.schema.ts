import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.PostSelect> = z
  .object({
    id: z.boolean().optional(),
    title: z.boolean().optional(),
    datePublished: z.boolean().optional(),
    content: z.boolean().optional(),
    image: z.boolean().optional(),
    contentImages: z.boolean().optional(),
    status: z.boolean().optional(),
    slug: z.boolean().optional(),
    excerpt: z.boolean().optional(),
    type: z.boolean().optional(),
    typeId: z.boolean().optional(),
    createTime: z.boolean().optional(),
    domainId: z.boolean().optional(),
  })
  .strict();

export const PostSelectObjectSchema = Schema;
