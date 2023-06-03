import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.PageCreateInput> = z
  .object({
    title: z.string(),
    content: z.string(),
    excerpt: z.string(),
    slug: z.string(),
    lastModified: z.coerce.date().optional(),
    isEmbed: z.boolean().optional(),
  })
  .strict();

export const PageCreateInputObjectSchema = Schema;
