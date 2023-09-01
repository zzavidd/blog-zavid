import { z } from 'zod';
import { DiaryCategoryOrderByRelevanceFieldEnumSchema } from '../enums/DiaryCategoryOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCategoryOrderByRelevanceInput> = z
  .object({
    fields: z.union([
      z.lazy(() => DiaryCategoryOrderByRelevanceFieldEnumSchema),
      z.lazy(() => DiaryCategoryOrderByRelevanceFieldEnumSchema).array(),
    ]),
    sort: z.lazy(() => SortOrderSchema),
    search: z.string(),
  })
  .strict();

export const DiaryCategoryOrderByRelevanceInputObjectSchema = Schema;
