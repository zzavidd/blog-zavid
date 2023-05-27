import { z } from 'zod';

export const WishlistVisibilitySchema = z.enum(['PUBLIC', 'PRIVATE']);
