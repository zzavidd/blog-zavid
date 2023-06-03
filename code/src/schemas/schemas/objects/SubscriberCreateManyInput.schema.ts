import { z } from 'zod';
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

const Schema: z.ZodType<Prisma.SubscriberCreateManyInput> = z
  .object({
    id: z.number().optional(),
    email: z.string(),
    firstname: z.string().optional().nullable(),
    lastname: z.string().optional().nullable(),
    subscriptions: z.union([
      z.lazy(() => JsonNullValueInputSchema),
      jsonSchema,
    ]),
    token: z.string(),
    createTime: z.coerce.date().optional(),
  })
  .strict();

export const SubscriberCreateManyInputObjectSchema = Schema;
