import { z } from 'zod';
import { WishlistItemCreateManyInputObjectSchema } from './objects/WishlistItemCreateManyInput.schema';

export const WishlistItemCreateManySchema = z.object({
  data: z.union([
    WishlistItemCreateManyInputObjectSchema,
    z.array(WishlistItemCreateManyInputObjectSchema),
  ]),
  skipDuplicates: z.boolean().optional(),
});
