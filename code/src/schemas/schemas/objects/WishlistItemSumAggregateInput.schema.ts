import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistItemSumAggregateInputType> = z
  .object({
    id: z.literal(true).optional(),
    price: z.literal(true).optional(),
    quantity: z.literal(true).optional(),
    categoryId: z.literal(true).optional(),
  })
  .strict();

export const WishlistItemSumAggregateInputObjectSchema = Schema;
