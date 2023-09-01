import { z } from 'zod';
import { DiaryOrderByRelevanceFieldEnumSchema } from '../enums/DiaryOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryOrderByRelevanceInput> = z
  .object({
    fields: z.union([
      z.lazy(() => DiaryOrderByRelevanceFieldEnumSchema),
      z.lazy(() => DiaryOrderByRelevanceFieldEnumSchema).array(),
    ]),
    sort: z.lazy(() => SortOrderSchema),
    search: z.string(),
  })
  .strict();

export const DiaryOrderByRelevanceInputObjectSchema = Schema;
