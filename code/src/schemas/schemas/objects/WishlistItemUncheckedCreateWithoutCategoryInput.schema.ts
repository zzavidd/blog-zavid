import { z } from 'zod';
import { WishlistPrioritySchema } from '../enums/WishlistPriority.schema';
import { WishlistVisibilitySchema } from '../enums/WishlistVisibility.schema';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    literalSchema,
    z.array(jsonSchema.nullable()),
    z.record(jsonSchema.nullable()),
  ]),
);

const Schema: z.ZodType<Prisma.WishlistItemUncheckedCreateWithoutCategoryInput> =
  z
    .object({
      id: z.number().optional(),
      name: z.string(),
      price: z.number(),
      quantity: z.number(),
      priority: z.lazy(() => WishlistPrioritySchema),
      visibility: z.lazy(() => WishlistVisibilitySchema),
      image: z.string(),
      href: z.string(),
      comments: z.string(),
      reservees: z.union([z.lazy(() => JsonNullValueInputSchema), jsonSchema]),
      purchaseDate: z.coerce.date().optional().nullable(),
      createTime: z.coerce.date().optional(),
    })
    .strict();

export const WishlistItemUncheckedCreateWithoutCategoryInputObjectSchema =
  Schema;