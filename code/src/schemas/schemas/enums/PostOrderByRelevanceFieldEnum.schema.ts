import { z } from 'zod';

export const PostOrderByRelevanceFieldEnumSchema = z.enum([
  'title',
  'content',
  'image',
  'contentImages',
  'slug',
  'excerpt',
]);
