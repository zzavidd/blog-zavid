import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.PageWhereUniqueInput> = z
  .object({
    id: z.number().optional(),
    slug: z.string().optional(),
  })
  .strict();

export const PageWhereUniqueInputObjectSchema = Schema;
