import { DiaryStatus } from '@prisma/client';
import { z } from 'zod';

import DiaryCategoryCreateArgsSchema from 'schemas/outputTypeSchemas/DiaryCategoryCreateArgsSchema';
import DiaryCategoryDeleteArgsSchema from 'schemas/outputTypeSchemas/DiaryCategoryDeleteArgsSchema';
import DiaryCategoryUpdateArgsSchema from 'schemas/outputTypeSchemas/DiaryCategoryUpdateArgsSchema';
import DiaryCreateArgsSchema from 'schemas/outputTypeSchemas/DiaryCreateArgsSchema';
import DiaryFindFirstArgsSchema from 'schemas/outputTypeSchemas/DiaryFindFirstArgsSchema';
import DiaryFindManyArgsSchema from 'schemas/outputTypeSchemas/DiaryFindManyArgsSchema';
import DiaryUpdateArgsSchema from 'schemas/outputTypeSchemas/DiaryUpdateArgsSchema';
import DiaryAPI from 'server/api/diary';
import DiaryCategoryAPI from 'server/api/diaryCategory';
import { procedure, router } from 'server/trpc';
import { zEmailPreviewType, zFindOptions } from 'utils/validators';

export const diaryRouter = router({
  find: procedure
    .input(
      z.object({
        params: DiaryFindFirstArgsSchema,
        options: zFindOptions,
      }),
    )
    .query(({ input }) => DiaryAPI.find(input.params, input.options)),
  findMany: procedure
    .input(
      z.object({
        params: DiaryFindManyArgsSchema,
        options: zFindOptions,
      }),
    )
    .query(({ input }) => DiaryAPI.findMany(input.params, input.options)),
  create: procedure
    .input(
      z.object({
        diary: DiaryCreateArgsSchema,
        isPublish: z.boolean().optional(),
      }),
    )
    .mutation(({ input }) => DiaryAPI.create(input.diary, input.isPublish)),
  update: procedure
    .input(
      z.object({
        diary: DiaryUpdateArgsSchema,
        isPublish: z.boolean().optional(),
      }),
    )
    .mutation(({ input }) => DiaryAPI.update(input.diary, input.isPublish)),
  delete: procedure
    .input(z.array(z.number()))
    .mutation(({ input }) => DiaryAPI.delete(input)),
  custom: router({
    latest: procedure.query(() =>
      DiaryAPI.find(
        {
          orderBy: { entryNumber: 'desc' },
          where: { status: DiaryStatus.PUBLISHED },
        },
        {
          contentWordLimit: 50,
        },
      ),
    ),
    preview: procedure
      .input(z.object({ id: z.number(), type: zEmailPreviewType }))
      .mutation(({ input }) => DiaryAPI.publish(input.id, input.type)),
  }),
});

export const diaryCategoryRouter = router({
  findMany: procedure.query(() => DiaryCategoryAPI.findMany()),
  create: procedure
    .input(DiaryCategoryCreateArgsSchema)
    .mutation(({ input }) => DiaryCategoryAPI.create(input)),
  update: procedure
    .input(DiaryCategoryUpdateArgsSchema)
    .mutation(({ input }) => DiaryCategoryAPI.update(input)),
  delete: procedure
    .input(DiaryCategoryDeleteArgsSchema)
    .mutation(({ input }) => DiaryCategoryAPI.delete(input)),
});
