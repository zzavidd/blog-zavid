import { z } from 'zod';

export const DiaryOrderByRelevanceFieldEnumSchema = z.enum([
  'title',
  'content',
  'footnote',
]);
