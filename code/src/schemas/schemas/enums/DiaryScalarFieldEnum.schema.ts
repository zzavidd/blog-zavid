import { z } from 'zod';

export const DiaryScalarFieldEnumSchema = z.enum([
  'id',
  'title',
  'date',
  'content',
  'slug',
  'status',
  'entryNumber',
  'footnote',
  'isFavourite',
  'tags',
]);
