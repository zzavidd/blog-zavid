import { z } from 'zod';
import { IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { EnumExclusiveStatusWithAggregatesFilterObjectSchema } from './EnumExclusiveStatusWithAggregatesFilter.schema';
import { ExclusiveStatusSchema } from '../enums/ExclusiveStatus.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ExclusiveScalarWhereWithAggregatesInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => ExclusiveScalarWhereWithAggregatesInputObjectSchema),
        z
          .lazy(() => ExclusiveScalarWhereWithAggregatesInputObjectSchema)
          .array(),
      ])
      .optional(),
    OR: z
      .lazy(() => ExclusiveScalarWhereWithAggregatesInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => ExclusiveScalarWhereWithAggregatesInputObjectSchema),
        z
          .lazy(() => ExclusiveScalarWhereWithAggregatesInputObjectSchema)
          .array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number()])
      .optional(),
    subject: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
    content: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
    preview: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
    endearment: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
    date: z
      .union([
        z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema),
        z.coerce.date(),
      ])
      .optional()
      .nullable(),
    status: z
      .union([
        z.lazy(() => EnumExclusiveStatusWithAggregatesFilterObjectSchema),
        z.lazy(() => ExclusiveStatusSchema),
      ])
      .optional(),
  })
  .strict();

export const ExclusiveScalarWhereWithAggregatesInputObjectSchema = Schema;
