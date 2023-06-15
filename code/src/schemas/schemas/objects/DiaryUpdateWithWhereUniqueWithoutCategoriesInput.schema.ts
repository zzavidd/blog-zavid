import { z } from 'zod';
import { DiaryWhereUniqueInputObjectSchema } from './DiaryWhereUniqueInput.schema';
import { DiaryUpdateWithoutCategoriesInputObjectSchema } from './DiaryUpdateWithoutCategoriesInput.schema';
import { DiaryUncheckedUpdateWithoutCategoriesInputObjectSchema } from './DiaryUncheckedUpdateWithoutCategoriesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryUpdateWithWhereUniqueWithoutCategoriesInput> =
  z
    .object({
      where: z.lazy(() => DiaryWhereUniqueInputObjectSchema),
      data: z.union([
        z.lazy(() => DiaryUpdateWithoutCategoriesInputObjectSchema),
        z.lazy(() => DiaryUncheckedUpdateWithoutCategoriesInputObjectSchema),
      ]),
    })
    .strict();

export const DiaryUpdateWithWhereUniqueWithoutCategoriesInputObjectSchema =
  Schema;
