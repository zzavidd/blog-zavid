import { z } from 'zod';

import {
  WishlistCategoryCreateArgsSchema,
  WishlistCategoryDeleteArgsSchema,
  WishlistCategoryFindManyArgsSchema,
  WishlistCategoryUpdateArgsSchema,
  WishlistItemCreateArgsSchema,
  WishlistItemDeleteArgsSchema,
  WishlistItemFindManyArgsSchema,
  WishlistItemUpdateArgsSchema,
} from 'schemas';
import { WishlistAPI, WishlistCategoryAPI } from 'server/api/wishlist';
import prisma from 'server/prisma';
import { procedure, router } from 'server/trpc';
import {
  zEmailPreviewType,
  zWishlistClaimPayload,
  zWishlistUnclaimPayload,
} from 'utils/validators';

export const wishlistRouter = router({
  findMany: procedure
    .input(WishlistItemFindManyArgsSchema)
    .query(({ input }) => WishlistAPI.findMany(input)),
  create: procedure
    .input(WishlistItemCreateArgsSchema)
    .mutation(({ input }) => WishlistAPI.create(input)),
  update: procedure
    .input(WishlistItemUpdateArgsSchema)
    .mutation(({ input }) => WishlistAPI.update(input)),
  delete: procedure
    .input(WishlistItemDeleteArgsSchema)
    .mutation(({ input }) => WishlistAPI.delete(input)),
  claim: procedure
    .input(zWishlistClaimPayload)
    .mutation(({ input }) => WishlistAPI.claim(input)),
  unclaim: procedure
    .input(zWishlistUnclaimPayload)
    .mutation(({ input }) => WishlistAPI.unclaim(input)),
  notify: procedure
    .input(z.object({ id: z.number(), type: zEmailPreviewType }))
    .mutation(({ input }) => WishlistAPI.notify(input.id, input.type)),
});

export const wishlistCategoryRouter = router({
  findMany: procedure
    .input(WishlistCategoryFindManyArgsSchema)
    .query(({ input }) => prisma.wishlistCategory.findMany(input)),
  create: procedure
    .input(WishlistCategoryCreateArgsSchema)
    .mutation(({ input }) => WishlistCategoryAPI.create(input)),
  update: procedure
    .input(WishlistCategoryUpdateArgsSchema)
    .mutation(({ input }) => WishlistCategoryAPI.update(input)),
  delete: procedure
    .input(WishlistCategoryDeleteArgsSchema)
    .mutation(({ input }) => WishlistCategoryAPI.delete(input)),
  count: procedure.query(() => WishlistCategoryAPI.count()),
});
