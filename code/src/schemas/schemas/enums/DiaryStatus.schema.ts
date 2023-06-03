import { z } from 'zod';

export const DiaryStatusSchema = z.enum([
  'DRAFT',
  'PROTECTED',
  'PRIVATE',
  'PUBLISHED',
]);
