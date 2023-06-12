import { z } from 'zod';
import { IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DiaryUncheckedUpdateManyWithoutCategoriesNestedInputObjectSchema } from './DiaryUncheckedUpdateManyWithoutCategoriesNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCategoryUncheckedUpdateInput> = z
  .object({
    id: z
      .union([
        z.number(),
        z.lazy(() => IntFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    name: z
      .union([
        z.string(),
        z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    entries: z
      .lazy(
        () => DiaryUncheckedUpdateManyWithoutCategoriesNestedInputObjectSchema,
      )
      .optional(),
  })
  .strict();

export const DiaryCategoryUncheckedUpdateInputObjectSchema = Schema;
