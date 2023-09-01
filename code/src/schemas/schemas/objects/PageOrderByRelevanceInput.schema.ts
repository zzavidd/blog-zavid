import { z } from 'zod';
import { PageOrderByRelevanceFieldEnumSchema } from '../enums/PageOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.PageOrderByRelevanceInput> = z
  .object({
    fields: z.union([
      z.lazy(() => PageOrderByRelevanceFieldEnumSchema),
      z.lazy(() => PageOrderByRelevanceFieldEnumSchema).array(),
    ]),
    sort: z.lazy(() => SortOrderSchema),
    search: z.string(),
  })
  .strict();

export const PageOrderByRelevanceInputObjectSchema = Schema;
