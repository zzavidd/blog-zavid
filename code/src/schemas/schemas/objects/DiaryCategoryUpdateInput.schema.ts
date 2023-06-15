import { z } from 'zod';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DiaryUpdateManyWithoutCategoriesNestedInputObjectSchema } from './DiaryUpdateManyWithoutCategoriesNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCategoryUpdateInput> = z
  .object({
    name: z
      .union([
        z.string(),
        z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    entries: z
      .lazy(() => DiaryUpdateManyWithoutCategoriesNestedInputObjectSchema)
      .optional(),
  })
  .strict();

export const DiaryCategoryUpdateInputObjectSchema = Schema;
