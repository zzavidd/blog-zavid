import { z } from 'zod';
import { WishlistVisibilitySchema } from '../enums/WishlistVisibility.schema';
import { WishlistPrioritySchema } from '../enums/WishlistPriority.schema';
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

const Schema: z.ZodType<Prisma.WishlistItemCreateWithoutCategoryInput> = z
  .object({
    name: z.string(),
    price: z.number(),
    comments: z.string(),
    quantity: z.number(),
    visibility: z.lazy(() => WishlistVisibilitySchema),
    priority: z.lazy(() => WishlistPrioritySchema),
    image: z.string(),
    href: z.string(),
    reservees: z
      .union([z.lazy(() => JsonNullValueInputSchema), jsonSchema])
      .optional(),
    purchaseDate: z.coerce.date().optional().nullable(),
    createTime: z.coerce.date().optional(),
  })
  .strict();

export const WishlistItemCreateWithoutCategoryInputObjectSchema = Schema;
