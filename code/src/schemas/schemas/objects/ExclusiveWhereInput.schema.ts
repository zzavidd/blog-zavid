import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { EnumExclusiveStatusFilterObjectSchema } from './EnumExclusiveStatusFilter.schema';
import { ExclusiveStatusSchema } from '../enums/ExclusiveStatus.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ExclusiveWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => ExclusiveWhereInputObjectSchema),
        z.lazy(() => ExclusiveWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => ExclusiveWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => ExclusiveWhereInputObjectSchema),
        z.lazy(() => ExclusiveWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
    subject: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    content: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    preview: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    endearment: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    date: z
      .union([
        z.lazy(() => DateTimeNullableFilterObjectSchema),
        z.coerce.date(),
      ])
      .optional()
      .nullable(),
    status: z
      .union([
        z.lazy(() => EnumExclusiveStatusFilterObjectSchema),
        z.lazy(() => ExclusiveStatusSchema),
      ])
      .optional(),
    slug: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
  })
  .strict();

export const ExclusiveWhereInputObjectSchema = Schema;
