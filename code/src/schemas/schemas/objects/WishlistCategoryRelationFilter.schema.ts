import { z } from 'zod';
import { WishlistCategoryWhereInputObjectSchema } from './WishlistCategoryWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistCategoryRelationFilter> = z
  .object({
    is: z
      .lazy(() => WishlistCategoryWhereInputObjectSchema)
      .optional()
      .nullable(),
    isNot: z
      .lazy(() => WishlistCategoryWhereInputObjectSchema)
      .optional()
      .nullable(),
  })
  .strict();

export const WishlistCategoryRelationFilterObjectSchema = Schema;
