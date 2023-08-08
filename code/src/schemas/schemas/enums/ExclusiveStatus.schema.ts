import { z } from 'zod';

export const ExclusiveStatusSchema = z.enum(['DRAFT', 'PUBLISHED']);
