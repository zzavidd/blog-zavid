import { z } from 'zod';
import { DiaryWhereUniqueInputObjectSchema } from './DiaryWhereUniqueInput.schema';
import { DiaryCreateWithoutCategoriesInputObjectSchema } from './DiaryCreateWithoutCategoriesInput.schema';
import { DiaryUncheckedCreateWithoutCategoriesInputObjectSchema } from './DiaryUncheckedCreateWithoutCategoriesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCreateOrConnectWithoutCategoriesInput> = z
  .object({
    where: z.lazy(() => DiaryWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => DiaryCreateWithoutCategoriesInputObjectSchema),
      z.lazy(() => DiaryUncheckedCreateWithoutCategoriesInputObjectSchema),
    ]),
  })
  .strict();

export const DiaryCreateOrConnectWithoutCategoriesInputObjectSchema = Schema;
