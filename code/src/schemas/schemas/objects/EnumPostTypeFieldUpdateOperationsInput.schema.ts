import { z } from 'zod';
import { PostTypeSchema } from '../enums/PostType.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumPostTypeFieldUpdateOperationsInput> = z
  .object({
    set: z.lazy(() => PostTypeSchema).optional(),
  })
  .strict();

export const EnumPostTypeFieldUpdateOperationsInputObjectSchema = Schema;
