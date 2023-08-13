import { ExclusiveStatus, type Exclusive, type Prisma } from '@prisma/client';
import nodemailer from 'nodemailer';
import invariant from 'tiny-invariant';

import Emailer from 'server/emails';
import prisma from 'server/prisma';

export default class ExclusiveAPI {
  public static findMany(args: Prisma.ExclusiveArgs): Promise<Exclusive[]> {
    return prisma.exclusive.findMany(args);
  }

  public static find(
    args: Prisma.ExclusiveFindFirstArgs,
  ): Promise<Exclusive | null> {
    return prisma.exclusive.findFirst(args);
  }

  public static async create(
    args: Prisma.ExclusiveCreateArgs,
    isPublish = false,
  ): Promise<Exclusive> {
    const exclusive = await prisma.exclusive.create(args);
    if (isPublish) {
      void Emailer.notifyExclusive(exclusive);
    }
    return exclusive;
  }

  public static async update(
    args: Prisma.ExclusiveUpdateArgs,
    isPublish = false,
  ): Promise<Exclusive> {
    const exclusive = await prisma.exclusive.update(args);
    if (isPublish) {
      void Emailer.notifyExclusive(exclusive);
    }
    return exclusive;
  }

  public static async delete(args: Prisma.ExclusiveDeleteArgs): Promise<void> {
    await prisma.exclusive.delete(args);
  }

  public static async index(id: number): Promise<number> {
    const exclusives = await prisma.exclusive.findMany({
      where: { status: ExclusiveStatus.PUBLISHED },
      orderBy: { date: 'asc' },
    });
    return exclusives.findIndex((p) => p.id === id) + 1;
  }

  public static async publish(
    id: number,
    options: NotifyOptions,
  ): Promise<string> {
    const exclusive = await this.find({ where: { id } });
    invariant(exclusive, 'No exclusive with ID found.');
    const [info] = await Emailer.notifyExclusive(exclusive, options);
    return nodemailer.getTestMessageUrl(info) || '';
  }
}
