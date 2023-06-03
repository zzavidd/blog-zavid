import { z } from 'zod';
import { WishlistItemWhereInputObjectSchema } from './WishlistItemWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistItemListRelationFilter> = z
  .object({
    every: z.lazy(() => WishlistItemWhereInputObjectSchema).optional(),
    some: z.lazy(() => WishlistItemWhereInputObjectSchema).optional(),
    none: z.lazy(() => WishlistItemWhereInputObjectSchema).optional(),
  })
  .strict();

export const WishlistItemListRelationFilterObjectSchema = Schema;
