import { z } from 'zod';

export const WishlistItemOrderByRelevanceFieldEnumSchema = z.enum([
  'name',
  'image',
  'href',
  'comments',
]);
