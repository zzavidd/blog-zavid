import { z } from 'zod';
import { DiaryStatusSchema } from '../enums/DiaryStatus.schema';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    literalSchema,
    z.array(jsonSchema.nullable()),
    z.record(jsonSchema.nullable()),
  ]),
);

const Schema: z.ZodType<Prisma.DiaryUncheckedCreateInput> = z
  .object({
    id: z.number().optional(),
    title: z.string(),
    date: z.coerce.date().optional().nullable(),
    content: z.string(),
    status: z.lazy(() => DiaryStatusSchema),
    entryNumber: z.number(),
    footnote: z.string(),
    isFavourite: z.boolean().optional(),
    tags: z
      .union([z.lazy(() => JsonNullValueInputSchema), jsonSchema])
      .optional(),
  })
  .strict();

export const DiaryUncheckedCreateInputObjectSchema = Schema;
