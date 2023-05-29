import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistItemMinAggregateInputType> = z
  .object({
    id: z.literal(true).optional(),
    name: z.literal(true).optional(),
    price: z.literal(true).optional(),
    quantity: z.literal(true).optional(),
    categoryId: z.literal(true).optional(),
    priority: z.literal(true).optional(),
    visibility: z.literal(true).optional(),
    image: z.literal(true).optional(),
    href: z.literal(true).optional(),
    comments: z.literal(true).optional(),
    purchaseDate: z.literal(true).optional(),
    createTime: z.literal(true).optional(),
  })
  .strict();

export const WishlistItemMinAggregateInputObjectSchema = Schema;
