import { z } from 'zod';
import { DiaryStatusSchema } from '../enums/DiaryStatus.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumDiaryStatusFieldUpdateOperationsInput> = z
  .object({
    set: z.lazy(() => DiaryStatusSchema).optional(),
  })
  .strict();

export const EnumDiaryStatusFieldUpdateOperationsInputObjectSchema = Schema;
