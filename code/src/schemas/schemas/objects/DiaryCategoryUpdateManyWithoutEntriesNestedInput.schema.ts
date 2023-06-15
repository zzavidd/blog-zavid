import { z } from 'zod';
import { DiaryCategoryCreateWithoutEntriesInputObjectSchema } from './DiaryCategoryCreateWithoutEntriesInput.schema';
import { DiaryCategoryUncheckedCreateWithoutEntriesInputObjectSchema } from './DiaryCategoryUncheckedCreateWithoutEntriesInput.schema';
import { DiaryCategoryCreateOrConnectWithoutEntriesInputObjectSchema } from './DiaryCategoryCreateOrConnectWithoutEntriesInput.schema';
import { DiaryCategoryUpsertWithWhereUniqueWithoutEntriesInputObjectSchema } from './DiaryCategoryUpsertWithWhereUniqueWithoutEntriesInput.schema';
import { DiaryCategoryWhereUniqueInputObjectSchema } from './DiaryCategoryWhereUniqueInput.schema';
import { DiaryCategoryUpdateWithWhereUniqueWithoutEntriesInputObjectSchema } from './DiaryCategoryUpdateWithWhereUniqueWithoutEntriesInput.schema';
import { DiaryCategoryUpdateManyWithWhereWithoutEntriesInputObjectSchema } from './DiaryCategoryUpdateManyWithWhereWithoutEntriesInput.schema';
import { DiaryCategoryScalarWhereInputObjectSchema } from './DiaryCategoryScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCategoryUpdateManyWithoutEntriesNestedInput> =
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
      upsert: z
        .union([
          z.lazy(
            () =>
              DiaryCategoryUpsertWithWhereUniqueWithoutEntriesInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                DiaryCategoryUpsertWithWhereUniqueWithoutEntriesInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      set: z
        .union([
          z.lazy(() => DiaryCategoryWhereUniqueInputObjectSchema),
          z.lazy(() => DiaryCategoryWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => DiaryCategoryWhereUniqueInputObjectSchema),
          z.lazy(() => DiaryCategoryWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => DiaryCategoryWhereUniqueInputObjectSchema),
          z.lazy(() => DiaryCategoryWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => DiaryCategoryWhereUniqueInputObjectSchema),
          z.lazy(() => DiaryCategoryWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () =>
              DiaryCategoryUpdateWithWhereUniqueWithoutEntriesInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                DiaryCategoryUpdateWithWhereUniqueWithoutEntriesInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () =>
              DiaryCategoryUpdateManyWithWhereWithoutEntriesInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                DiaryCategoryUpdateManyWithWhereWithoutEntriesInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => DiaryCategoryScalarWhereInputObjectSchema),
          z.lazy(() => DiaryCategoryScalarWhereInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const DiaryCategoryUpdateManyWithoutEntriesNestedInputObjectSchema =
  Schema;
