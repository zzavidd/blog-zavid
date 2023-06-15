import { z } from 'zod';
import { DiaryCategoryCountOutputTypeSelectObjectSchema } from './DiaryCategoryCountOutputTypeSelect.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.DiaryCategoryCountOutputTypeArgs> = z
  .object({
    select: z
      .lazy(() => DiaryCategoryCountOutputTypeSelectObjectSchema)
      .optional(),
  })
  .strict();

export const DiaryCategoryCountOutputTypeArgsObjectSchema = Schema;
