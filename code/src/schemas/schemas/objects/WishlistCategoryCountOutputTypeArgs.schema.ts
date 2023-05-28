import { z } from 'zod';
import { WishlistCategoryCountOutputTypeSelectObjectSchema } from './WishlistCategoryCountOutputTypeSelect.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistCategoryCountOutputTypeArgs> = z
  .object({
    select: z
      .lazy(() => WishlistCategoryCountOutputTypeSelectObjectSchema)
      .optional(),
  })
  .strict();

export const WishlistCategoryCountOutputTypeArgsObjectSchema = Schema;
