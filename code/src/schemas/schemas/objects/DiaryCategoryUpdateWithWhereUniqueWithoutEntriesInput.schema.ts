import { z } from 'zod';
import { DiaryCategoryWhereUniqueInputObjectSchema } from './DiaryCategoryWhereUniqueInput.schema';
import { DiaryCategoryUpdateWithoutEntriesInputObjectSchema } from './DiaryCategoryUpdateWithoutEntriesInput.schema';
import { DiaryCategoryUncheckedUpdateWithoutEntriesInputObjectSchema } from './DiaryCategoryUncheckedUpdateWithoutEntriesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCategoryUpdateWithWhereUniqueWithoutEntriesInput> =
  z
    .object({
      where: z.lazy(() => DiaryCategoryWhereUniqueInputObjectSchema),
      data: z.union([
        z.lazy(() => DiaryCategoryUpdateWithoutEntriesInputObjectSchema),
        z.lazy(
          () => DiaryCategoryUncheckedUpdateWithoutEntriesInputObjectSchema,
        ),
      ]),
    })
    .strict();

export const DiaryCategoryUpdateWithWhereUniqueWithoutEntriesInputObjectSchema =
  Schema;
