import { z } from 'zod';

export const ExclusiveScalarFieldEnumSchema = z.enum([
  'id',
  'subject',
  'content',
  'preview',
  'endearment',
  'date',
  'status',
]);
