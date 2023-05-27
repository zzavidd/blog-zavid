import { z } from 'zod';

export const WishlistPrioritySchema = z.enum(['HIGH', 'MEDIUM', 'LOW']);
