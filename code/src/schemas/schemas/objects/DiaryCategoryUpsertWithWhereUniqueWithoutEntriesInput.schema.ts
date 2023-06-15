import { z } from 'zod';
import { DiaryCategoryWhereUniqueInputObjectSchema } from './DiaryCategoryWhereUniqueInput.schema';
import { DiaryCategoryUpdateWithoutEntriesInputObjectSchema } from './DiaryCategoryUpdateWithoutEntriesInput.schema';
import { DiaryCategoryUncheckedUpdateWithoutEntriesInputObjectSchema } from './DiaryCategoryUncheckedUpdateWithoutEntriesInput.schema';
import { DiaryCategoryCreateWithoutEntriesInputObjectSchema } from './DiaryCategoryCreateWithoutEntriesInput.schema';
import { DiaryCategoryUncheckedCreateWithoutEntriesInputObjectSchema } from './DiaryCategoryUncheckedCreateWithoutEntriesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCategoryUpsertWithWhereUniqueWithoutEntriesInput> =
  z
    .object({
      where: z.lazy(() => DiaryCategoryWhereUniqueInputObjectSchema),
      update: z.union([
        z.lazy(() => DiaryCategoryUpdateWithoutEntriesInputObjectSchema),
        z.lazy(
          () => DiaryCategoryUncheckedUpdateWithoutEntriesInputObjectSchema,
        ),
      ]),
      create: z.union([
        z.lazy(() => DiaryCategoryCreateWithoutEntriesInputObjectSchema),
        z.lazy(
          () => DiaryCategoryUncheckedCreateWithoutEntriesInputObjectSchema,
        ),
      ]),
    })
    .strict();

export const DiaryCategoryUpsertWithWhereUniqueWithoutEntriesInputObjectSchema =
  Schema;
