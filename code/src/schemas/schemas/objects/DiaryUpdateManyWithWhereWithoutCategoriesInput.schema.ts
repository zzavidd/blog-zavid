import { z } from 'zod';
import { DiaryScalarWhereInputObjectSchema } from './DiaryScalarWhereInput.schema';
import { DiaryUpdateManyMutationInputObjectSchema } from './DiaryUpdateManyMutationInput.schema';
import { DiaryUncheckedUpdateManyWithoutEntriesInputObjectSchema } from './DiaryUncheckedUpdateManyWithoutEntriesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryUpdateManyWithWhereWithoutCategoriesInput> =
  z
    .object({
      where: z.lazy(() => DiaryScalarWhereInputObjectSchema),
      data: z.union([
        z.lazy(() => DiaryUpdateManyMutationInputObjectSchema),
        z.lazy(() => DiaryUncheckedUpdateManyWithoutEntriesInputObjectSchema),
      ]),
    })
    .strict();

export const DiaryUpdateManyWithWhereWithoutCategoriesInputObjectSchema =
  Schema;
