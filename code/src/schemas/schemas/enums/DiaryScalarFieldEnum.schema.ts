import { z } from 'zod';

export const DiaryScalarFieldEnumSchema = z.enum([
  'id',
  'title',
  'date',
  'content',
  'status',
  'entryNumber',
  'footnote',
  'isFavourite',
  'tags',
]);
