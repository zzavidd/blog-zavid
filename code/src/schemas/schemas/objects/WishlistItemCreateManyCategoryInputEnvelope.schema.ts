import { z } from 'zod';
import { WishlistItemCreateManyCategoryInputObjectSchema } from './WishlistItemCreateManyCategoryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.WishlistItemCreateManyCategoryInputEnvelope> = z
  .object({
    data: z.union([
      z.lazy(() => WishlistItemCreateManyCategoryInputObjectSchema),
      z.lazy(() => WishlistItemCreateManyCategoryInputObjectSchema).array(),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();

export const WishlistItemCreateManyCategoryInputEnvelopeObjectSchema = Schema;
