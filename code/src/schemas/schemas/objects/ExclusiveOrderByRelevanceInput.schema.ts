import { z } from 'zod';
import { ExclusiveOrderByRelevanceFieldEnumSchema } from '../enums/ExclusiveOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ExclusiveOrderByRelevanceInput> = z
  .object({
    fields: z.union([
      z.lazy(() => ExclusiveOrderByRelevanceFieldEnumSchema),
      z.lazy(() => ExclusiveOrderByRelevanceFieldEnumSchema).array(),
    ]),
    sort: z.lazy(() => SortOrderSchema),
    search: z.string(),
  })
  .strict();

export const ExclusiveOrderByRelevanceInputObjectSchema = Schema;
