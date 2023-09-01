import { z } from 'zod';

export const PageOrderByRelevanceFieldEnumSchema = z.enum([
  'title',
  'content',
  'excerpt',
  'slug',
]);
