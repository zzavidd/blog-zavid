import { z } from 'zod';
import { WishlistItemSelectObjectSchema } from './WishlistItemSelect.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistItemArgs> = z
  .object({
    select: z.lazy(() => WishlistItemSelectObjectSchema).optional(),
  })
  .strict();

export const WishlistItemArgsObjectSchema = Schema;
