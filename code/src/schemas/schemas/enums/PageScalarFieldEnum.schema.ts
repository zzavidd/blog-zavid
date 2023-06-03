import { z } from 'zod';

export const PageScalarFieldEnumSchema = z.enum([
  'id',
  'title',
  'content',
  'excerpt',
  'slug',
  'lastModified',
  'isEmbed',
]);
