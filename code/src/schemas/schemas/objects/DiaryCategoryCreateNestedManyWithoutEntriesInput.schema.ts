import { z } from 'zod';
import { DiaryCategoryCreateWithoutEntriesInputObjectSchema } from './DiaryCategoryCreateWithoutEntriesInput.schema';
import { DiaryCategoryUncheckedCreateWithoutEntriesInputObjectSchema } from './DiaryCategoryUncheckedCreateWithoutEntriesInput.schema';
import { DiaryCategoryCreateOrConnectWithoutEntriesInputObjectSchema } from './DiaryCategoryCreateOrConnectWithoutEntriesInput.schema';
import { DiaryCategoryWhereUniqueInputObjectSchema } from './DiaryCategoryWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCategoryCreateNestedManyWithoutEntriesInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => DiaryCategoryCreateWithoutEntriesInputObjectSchema),
          z
            .lazy(() => DiaryCategoryCreateWithoutEntriesInputObjectSchema)
            .array(),
          z.lazy(
            () => DiaryCategoryUncheckedCreateWithoutEntriesInputObjectSchema,
          ),
          z
            .lazy(
              () => DiaryCategoryUncheckedCreateWithoutEntriesInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => DiaryCategoryCreateOrConnectWithoutEntriesInputObjectSchema,
          ),
          z
            .lazy(
              () => DiaryCategoryCreateOrConnectWithoutEntriesInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => DiaryCategoryWhereUniqueInputObjectSchema),
          z.lazy(() => DiaryCategoryWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const DiaryCategoryCreateNestedManyWithoutEntriesInputObjectSchema =
  Schema;
