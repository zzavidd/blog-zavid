import type { Prisma, WishlistCategory, WishlistItem } from '@prisma/client';
import nodemailer from 'nodemailer';
import invariant from 'tiny-invariant';

import * as Emailer from 'server/emails';
import prisma from 'server/prisma';

export class WishlistAPI {
  public static find(
    args: Prisma.WishlistItemFindFirstArgs,
  ): Promise<WishlistItem | null> {
    return prisma.wishlistItem.findFirst(args);
  }

  public static findMany(
    args: Prisma.WishlistItemFindManyArgs,
  ): Promise<WishlistItem[]> {
    return prisma.wishlistItem.findMany(args);
  }

  public static create(
    args: Prisma.WishlistItemCreateArgs,
  ): Promise<WishlistItem> {
    return prisma.wishlistItem.create(args);
  }

  public static update(
    args: Prisma.WishlistItemUpdateArgs,
  ): Promise<WishlistItem> {
    return prisma.wishlistItem.update(args);
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
    const wishlistItem = await prisma.wishlistItem.update({
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

    await Emailer.notifyWishlistItemClaimant(wishlistItem, {
      directRecipients: [email],
    });
  }

  public static async unclaim({
    id,
    email,
  }: {
    id: number;
    email: string;
  }): Promise<void> {
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

  public static async notify(
    id: number,
    previewType: EmailPreviewType,
  ): Promise<string> {
    const wishlistItem = await this.find({ where: { id } });
    invariant(wishlistItem, 'No wishlist item with ID found.');
    const [info] = await Emailer.notifyWishlistItemClaimant(wishlistItem, {
      isPreview: true,
      previewType,
    });
    return nodemailer.getTestMessageUrl(info) || '';
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
