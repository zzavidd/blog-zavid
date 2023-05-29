import { z } from 'zod';
import { WishlistCategoryArgsObjectSchema } from './WishlistCategoryArgs.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistItemSelect> = z
  .object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    price: z.boolean().optional(),
    quantity: z.boolean().optional(),
    categoryId: z.boolean().optional(),
    priority: z.boolean().optional(),
    visibility: z.boolean().optional(),
    image: z.boolean().optional(),
    href: z.boolean().optional(),
    comments: z.boolean().optional(),
    reservees: z.boolean().optional(),
    purchaseDate: z.boolean().optional(),
    createTime: z.boolean().optional(),
    category: z
      .union([z.boolean(), z.lazy(() => WishlistCategoryArgsObjectSchema)])
      .optional(),
  })
  .strict();

export const WishlistItemSelectObjectSchema = Schema;
