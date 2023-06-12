import { z } from 'zod';
import { WishlistItemSelectObjectSchema } from './objects/WishlistItemSelect.schema';
import { WishlistItemIncludeObjectSchema } from './objects/WishlistItemInclude.schema';
import { WishlistItemOrderByWithRelationInputObjectSchema } from './objects/WishlistItemOrderByWithRelationInput.schema';
import { WishlistItemWhereInputObjectSchema } from './objects/WishlistItemWhereInput.schema';
import { WishlistItemWhereUniqueInputObjectSchema } from './objects/WishlistItemWhereUniqueInput.schema';
import { WishlistItemScalarFieldEnumSchema } from './enums/WishlistItemScalarFieldEnum.schema';

export const WishlistItemFindManySchema = z.object({
  select: z.lazy(() => WishlistItemSelectObjectSchema.optional()),
  include: z.lazy(() => WishlistItemIncludeObjectSchema.optional()),
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
