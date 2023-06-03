import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.PageCountAggregateInputType> = z
  .object({
    id: z.literal(true).optional(),
    title: z.literal(true).optional(),
    content: z.literal(true).optional(),
    excerpt: z.literal(true).optional(),
    slug: z.literal(true).optional(),
    lastModified: z.literal(true).optional(),
    isEmbed: z.literal(true).optional(),
    _all: z.literal(true).optional(),
  })
  .strict();

export const PageCountAggregateInputObjectSchema = Schema;
