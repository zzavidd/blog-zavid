import { z } from 'zod';
import { PostOrderByRelevanceFieldEnumSchema } from '../enums/PostOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.PostOrderByRelevanceInput> = z
  .object({
    fields: z.union([
      z.lazy(() => PostOrderByRelevanceFieldEnumSchema),
      z.lazy(() => PostOrderByRelevanceFieldEnumSchema).array(),
    ]),
    sort: z.lazy(() => SortOrderSchema),
    search: z.string(),
  })
  .strict();

export const PostOrderByRelevanceInputObjectSchema = Schema;
