import { z } from 'zod';
import { DiarySelectObjectSchema } from './objects/DiarySelect.schema';
import { DiaryIncludeObjectSchema } from './objects/DiaryInclude.schema';
import { DiaryWhereUniqueInputObjectSchema } from './objects/DiaryWhereUniqueInput.schema';
import { DiaryCreateInputObjectSchema } from './objects/DiaryCreateInput.schema';
import { DiaryUncheckedCreateInputObjectSchema } from './objects/DiaryUncheckedCreateInput.schema';
import { DiaryUpdateInputObjectSchema } from './objects/DiaryUpdateInput.schema';
import { DiaryUncheckedUpdateInputObjectSchema } from './objects/DiaryUncheckedUpdateInput.schema';

export const DiaryUpsertSchema = z.object({
  select: DiarySelectObjectSchema.optional(),
  include: DiaryIncludeObjectSchema.optional(),
  where: DiaryWhereUniqueInputObjectSchema,
  create: z.union([
    DiaryCreateInputObjectSchema,
    DiaryUncheckedCreateInputObjectSchema,
  ]),
  update: z.union([
    DiaryUpdateInputObjectSchema,
    DiaryUncheckedUpdateInputObjectSchema,
  ]),
});
