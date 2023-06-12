import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { EnumDiaryStatusFilterObjectSchema } from './EnumDiaryStatusFilter.schema';
import { DiaryStatusSchema } from '../enums/DiaryStatus.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { JsonFilterObjectSchema } from './JsonFilter.schema';
import { DiaryCategoryListRelationFilterObjectSchema } from './DiaryCategoryListRelationFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => DiaryWhereInputObjectSchema),
        z.lazy(() => DiaryWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => DiaryWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => DiaryWhereInputObjectSchema),
        z.lazy(() => DiaryWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
    title: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    date: z
      .union([
        z.lazy(() => DateTimeNullableFilterObjectSchema),
        z.coerce.date(),
      ])
      .optional()
      .nullable(),
    content: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    status: z
      .union([
        z.lazy(() => EnumDiaryStatusFilterObjectSchema),
        z.lazy(() => DiaryStatusSchema),
      ])
      .optional(),
    entryNumber: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
    footnote: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    isFavourite: z
      .union([z.lazy(() => BoolFilterObjectSchema), z.boolean()])
      .optional(),
    tags: z.lazy(() => JsonFilterObjectSchema).optional(),
    categories: z
      .lazy(() => DiaryCategoryListRelationFilterObjectSchema)
      .optional(),
  })
  .strict();

export const DiaryWhereInputObjectSchema = Schema;
