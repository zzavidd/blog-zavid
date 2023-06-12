import { z } from 'zod';
import { DiaryUncheckedCreateNestedManyWithoutCategoriesInputObjectSchema } from './DiaryUncheckedCreateNestedManyWithoutCategoriesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCategoryUncheckedCreateInput> = z
  .object({
    id: z.number().optional(),
    name: z.string(),
    entries: z
      .lazy(
        () => DiaryUncheckedCreateNestedManyWithoutCategoriesInputObjectSchema,
      )
      .optional(),
  })
  .strict();

export const DiaryCategoryUncheckedCreateInputObjectSchema = Schema;
