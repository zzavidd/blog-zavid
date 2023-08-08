import { z } from 'zod';
import { ExclusiveStatusSchema } from '../enums/ExclusiveStatus.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumExclusiveStatusFieldUpdateOperationsInput> =
  z
    .object({
      set: z.lazy(() => ExclusiveStatusSchema).optional(),
    })
    .strict();

export const EnumExclusiveStatusFieldUpdateOperationsInputObjectSchema = Schema;
