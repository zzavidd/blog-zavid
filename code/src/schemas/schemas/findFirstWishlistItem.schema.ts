import { z } from 'zod';
import { WishlistItemSelectObjectSchema } from './objects/WishlistItemSelect.schema';
import { WishlistItemOrderByWithRelationInputObjectSchema } from './objects/WishlistItemOrderByWithRelationInput.schema';
import { WishlistItemWhereInputObjectSchema } from './objects/WishlistItemWhereInput.schema';
import { WishlistItemWhereUniqueInputObjectSchema } from './objects/WishlistItemWhereUniqueInput.schema';
import { WishlistItemScalarFieldEnumSchema } from './enums/WishlistItemScalarFieldEnum.schema';

export const WishlistItemFindFirstSchema = z.object({
  select: WishlistItemSelectObjectSchema.optional(),
  orderBy: z
    .union([
      WishlistItemOrderByWithRelationInputObjectSchema,
      WishlistItemOrderByWithRelationInputObjectSchema.array(),
    ])
    .optional(),
  where: WishlistItemWhereInputObjectSchema.optional(),
  cursor: WishlistItemWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.array(WishlistItemScalarFieldEnumSchema).optional(),
});