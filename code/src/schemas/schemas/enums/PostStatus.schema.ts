import { z } from 'zod';

export const PostStatusSchema = z.enum([
  'DRAFT',
  'PROTECTED',
  'PRIVATE',
  'PUBLISHED',
]);
