import { z } from 'zod';

export const PostTypeSchema = z.enum([
  'REVERIE',
  'EPISTLE',
  'POEM',
  'MUSING',
  'ADDENDUM',
  'PASSAGE',
]);
