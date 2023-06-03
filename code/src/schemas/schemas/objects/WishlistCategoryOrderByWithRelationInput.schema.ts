import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { WishlistItemOrderByRelationAggregateInputObjectSchema } from './WishlistItemOrderByRelationAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistCategoryOrderByWithRelationInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    WishlistItem: z
      .lazy(() => WishlistItemOrderByRelationAggregateInputObjectSchema)
      .optional(),
  })
  .strict();

export const WishlistCategoryOrderByWithRelationInputObjectSchema = Schema;
