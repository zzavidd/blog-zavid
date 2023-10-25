import type { Prisma, WishlistCategory, WishlistItem } from '@prisma/client';

import prisma from 'server/prisma';

export class WishlistAPI {
  public static findMany(
    args: Prisma.WishlistItemFindManyArgs,
  ): Promise<WishlistItem[]> {
    return prisma.wishlistItem.findMany(args);
  }

  public static async create(
    args: Prisma.WishlistItemCreateArgs,
  ): Promise<void> {
    await prisma.wishlistItem.create(args);
  }

  public static async update(
    args: Prisma.WishlistItemUpdateArgs,
  ): Promise<void> {
    await prisma.wishlistItem.update(args);
  }

  public static async delete(
    args: Prisma.WishlistItemDeleteArgs,
  ): Promise<void> {
    await prisma.wishlistItem.delete(args);
  }

  public static count(args: Prisma.WishlistItemCountArgs): Promise<number> {
    return prisma.wishlistItem.count(args);
  }

  public static async claim(payload: WishlistClaimPayload): Promise<void> {
    const { id, email, quantity, anonymous } = payload;
    await prisma.wishlistItem.update({
      where: { id },
      data: {
        reservees: {
          [email]: {
            quantity,
            anonymous,
          },
        },
      },
    });

    // if (this.claimEmail) {
    //   await Emailer.notifyWishlistItemClaimant(item, email, this.claimEmail);
    // }
  }

  public static async unclaim({
    id,
    email,
  }: ItemPayload.Unclaim): Promise<void> {
    const item = await prisma.wishlistItem.findUniqueOrThrow({
      where: { id },
    });
    const reservees = { ...(item.reservees as WishlistReservees) };
    delete reservees[email];

    await prisma.wishlistItem.update({
      where: { id },
      data: { ...item, reservees },
    });
  }
}

export class WishlistCategoryAPI {
  public static findMany(
    args: Prisma.WishlistCategoryFindManyArgs,
  ): Promise<WishlistCategory[]> {
    return prisma.wishlistCategory.findMany(args);
  }

  public static async create(
    args: Prisma.WishlistCategoryCreateArgs,
  ): Promise<void> {
    await prisma.wishlistCategory.create(args);
  }

  public static async update(
    args: Prisma.WishlistCategoryUpdateArgs,
  ): Promise<void> {
    await prisma.wishlistCategory.update(args);
  }

  public static async delete(
    args: Prisma.WishlistCategoryDeleteArgs,
  ): Promise<void> {
    await prisma.wishlistCategory.delete(args);
  }

  public static count(): Promise<number> {
    return prisma.wishlistCategory.count();
  }
}
