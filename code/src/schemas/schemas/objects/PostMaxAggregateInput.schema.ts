import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.PostMaxAggregateInputType> = z
  .object({
    id: z.literal(true).optional(),
    title: z.literal(true).optional(),
    datePublished: z.literal(true).optional(),
    content: z.literal(true).optional(),
    image: z.literal(true).optional(),
    contentImages: z.literal(true).optional(),
    status: z.literal(true).optional(),
    slug: z.literal(true).optional(),
    excerpt: z.literal(true).optional(),
    type: z.literal(true).optional(),
    typeId: z.literal(true).optional(),
    createTime: z.literal(true).optional(),
    domainId: z.literal(true).optional(),
  })
  .strict();

export const PostMaxAggregateInputObjectSchema = Schema;
