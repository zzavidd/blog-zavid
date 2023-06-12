import { z } from 'zod';
import { DiaryCreateNestedManyWithoutCategoriesInputObjectSchema } from './DiaryCreateNestedManyWithoutCategoriesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCategoryCreateInput> = z
  .object({
    name: z.string(),
    entries: z
      .lazy(() => DiaryCreateNestedManyWithoutCategoriesInputObjectSchema)
      .optional(),
  })
  .strict();

export const DiaryCategoryCreateInputObjectSchema = Schema;
