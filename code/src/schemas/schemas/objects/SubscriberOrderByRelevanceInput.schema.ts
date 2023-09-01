import { z } from 'zod';
import { SubscriberOrderByRelevanceFieldEnumSchema } from '../enums/SubscriberOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriberOrderByRelevanceInput> = z
  .object({
    fields: z.union([
      z.lazy(() => SubscriberOrderByRelevanceFieldEnumSchema),
      z.lazy(() => SubscriberOrderByRelevanceFieldEnumSchema).array(),
    ]),
    sort: z.lazy(() => SortOrderSchema),
    search: z.string(),
  })
  .strict();

export const SubscriberOrderByRelevanceInputObjectSchema = Schema;
