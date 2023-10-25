import {
  WishlistCategoryCreateOneSchema,
  WishlistCategoryDeleteOneSchema,
  WishlistCategoryFindManySchema,
  WishlistCategoryUncheckedCreateInputObjectSchema,
  WishlistCategoryUncheckedUpdateInputObjectSchema,
  WishlistCategoryUpdateOneSchema,
  WishlistItemCreateOneSchema,
  WishlistItemDeleteOneSchema,
  WishlistItemFindManySchema,
  WishlistItemUncheckedCreateInputObjectSchema,
  WishlistItemUncheckedUpdateInputObjectSchema,
  WishlistItemUpdateOneSchema,
} from 'schemas/schemas';
import { WishlistAPI, WishlistCategoryAPI } from 'server/api/wishlist';
import prisma from 'server/prisma';
import { procedure, router } from 'server/trpc';
import {
  zWishlistClaimPayload,
  zWishlistUnclaimPayload,
} from 'utils/validators';

export const wishlistRouter = router({
  findMany: procedure
    .input(WishlistItemFindManySchema)
    .query(({ input }) => WishlistAPI.findMany(input)),
  create: procedure
    .input(
      WishlistItemCreateOneSchema.extend({
        data: WishlistItemUncheckedCreateInputObjectSchema,
      }),
    )
    .mutation(({ input }) => WishlistAPI.create(input)),
  update: procedure
    .input(
      WishlistItemUpdateOneSchema.extend({
        data: WishlistItemUncheckedUpdateInputObjectSchema,
      }),
    )
    .mutation(({ input }) => WishlistAPI.update(input)),
  delete: procedure
    .input(WishlistItemDeleteOneSchema)
    .mutation(({ input }) => WishlistAPI.delete(input)),
  claim: procedure
    .input(zWishlistClaimPayload)
    .mutation(({ input }) => WishlistAPI.claim(input)),
  unclaim: procedure
    .input(zWishlistUnclaimPayload)
    .mutation(({ input }) => WishlistAPI.unclaim(input)),
});

export const wishlistCategoryRouter = router({
  findMany: procedure
    .input(WishlistCategoryFindManySchema)
    .query(({ input }) => prisma.wishlistCategory.findMany(input)),
  create: procedure
    .input(
      WishlistCategoryCreateOneSchema.extend({
        data: WishlistCategoryUncheckedCreateInputObjectSchema,
      }),
    )
    .mutation(({ input }) => WishlistCategoryAPI.create(input)),
  update: procedure
    .input(
      WishlistCategoryUpdateOneSchema.extend({
        data: WishlistCategoryUncheckedUpdateInputObjectSchema,
      }),
    )
    .mutation(({ input }) => WishlistCategoryAPI.update(input)),
  delete: procedure
    .input(WishlistCategoryDeleteOneSchema)
    .mutation(({ input }) => WishlistCategoryAPI.delete(input)),
  count: procedure.query(() => WishlistCategoryAPI.count()),
});
