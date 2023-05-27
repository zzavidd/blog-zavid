import { z } from 'zod';
import { PostStatusSchema } from '../enums/PostStatus.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumPostStatusFieldUpdateOperationsInput> = z
  .object({
    set: z.lazy(() => PostStatusSchema).optional(),
  })
  .strict();

export const EnumPostStatusFieldUpdateOperationsInputObjectSchema = Schema;
