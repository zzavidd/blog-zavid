import { z } from 'zod';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { WishlistPrioritySchema } from '../enums/WishlistPriority.schema';
import { EnumWishlistPriorityFieldUpdateOperationsInputObjectSchema } from './EnumWishlistPriorityFieldUpdateOperationsInput.schema';
import { WishlistVisibilitySchema } from '../enums/WishlistVisibility.schema';
import { EnumWishlistVisibilityFieldUpdateOperationsInputObjectSchema } from './EnumWishlistVisibilityFieldUpdateOperationsInput.schema';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { WishlistCategoryUpdateOneWithoutWishlistItemNestedInputObjectSchema } from './WishlistCategoryUpdateOneWithoutWishlistItemNestedInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    literalSchema,
    z.array(jsonSchema.nullable()),
    z.record(jsonSchema.nullable()),
  ]),
);

const Schema: z.ZodType<Prisma.WishlistItemUpdateInput> = z
  .object({
    name: z
      .union([
        z.string(),
        z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    price: z
      .union([
        z.number(),
        z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    quantity: z
      .union([
        z.number(),
        z.lazy(() => IntFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    priority: z
      .union([
        z.lazy(() => WishlistPrioritySchema),
        z.lazy(
          () => EnumWishlistPriorityFieldUpdateOperationsInputObjectSchema,
        ),
      ])
      .optional(),
    visibility: z
      .union([
        z.lazy(() => WishlistVisibilitySchema),
        z.lazy(
          () => EnumWishlistVisibilityFieldUpdateOperationsInputObjectSchema,
        ),
      ])
      .optional(),
    image: z
      .union([
        z.string(),
        z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    href: z
      .union([
        z.string(),
        z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    comments: z
      .union([
        z.string(),
        z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    reservees: z
      .union([z.lazy(() => JsonNullValueInputSchema), jsonSchema])
      .optional(),
    purchaseDate: z
      .union([
        z.coerce.date(),
        z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema),
      ])
      .optional()
      .nullable(),
    createTime: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    category: z
      .lazy(
        () =>
          WishlistCategoryUpdateOneWithoutWishlistItemNestedInputObjectSchema,
      )
      .optional(),
  })
  .strict();

export const WishlistItemUpdateInputObjectSchema = Schema;
