import { z } from 'zod';
import { DiaryCategoryScalarWhereInputObjectSchema } from './DiaryCategoryScalarWhereInput.schema';
import { DiaryCategoryUpdateManyMutationInputObjectSchema } from './DiaryCategoryUpdateManyMutationInput.schema';
import { DiaryCategoryUncheckedUpdateManyWithoutCategoriesInputObjectSchema } from './DiaryCategoryUncheckedUpdateManyWithoutCategoriesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCategoryUpdateManyWithWhereWithoutEntriesInput> =
  z
    .object({
      where: z.lazy(() => DiaryCategoryScalarWhereInputObjectSchema),
      data: z.union([
        z.lazy(() => DiaryCategoryUpdateManyMutationInputObjectSchema),
        z.lazy(
          () =>
            DiaryCategoryUncheckedUpdateManyWithoutCategoriesInputObjectSchema,
        ),
      ]),
    })
    .strict();

export const DiaryCategoryUpdateManyWithWhereWithoutEntriesInputObjectSchema =
  Schema;
