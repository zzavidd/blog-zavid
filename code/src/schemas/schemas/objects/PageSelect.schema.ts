import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.PageSelect> = z
  .object({
    id: z.boolean().optional(),
    title: z.boolean().optional(),
    content: z.boolean().optional(),
    excerpt: z.boolean().optional(),
    slug: z.boolean().optional(),
    lastModified: z.boolean().optional(),
    isEmbed: z.boolean().optional(),
  })
  .strict();

export const PageSelectObjectSchema = Schema;
