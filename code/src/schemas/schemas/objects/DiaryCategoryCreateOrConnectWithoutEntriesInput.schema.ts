import { z } from 'zod';
import { DiaryCategoryWhereUniqueInputObjectSchema } from './DiaryCategoryWhereUniqueInput.schema';
import { DiaryCategoryCreateWithoutEntriesInputObjectSchema } from './DiaryCategoryCreateWithoutEntriesInput.schema';
import { DiaryCategoryUncheckedCreateWithoutEntriesInputObjectSchema } from './DiaryCategoryUncheckedCreateWithoutEntriesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCategoryCreateOrConnectWithoutEntriesInput> =
  z
    .object({
      where: z.lazy(() => DiaryCategoryWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => DiaryCategoryCreateWithoutEntriesInputObjectSchema),
        z.lazy(
          () => DiaryCategoryUncheckedCreateWithoutEntriesInputObjectSchema,
        ),
      ]),
    })
    .strict();

export const DiaryCategoryCreateOrConnectWithoutEntriesInputObjectSchema =
  Schema;
