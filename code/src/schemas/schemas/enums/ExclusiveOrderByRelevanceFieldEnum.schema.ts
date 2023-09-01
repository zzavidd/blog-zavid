import { z } from 'zod';

export const ExclusiveOrderByRelevanceFieldEnumSchema = z.enum([
  'subject',
  'content',
  'preview',
  'endearment',
  'slug',
]);
