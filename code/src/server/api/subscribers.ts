import type { Prisma, Subscriber } from '@prisma/client';
import immutate from 'immutability-helper';
import nodemailer from 'nodemailer';
import { v4 as UUIDv4 } from 'uuid';

import Emailer from 'server/emails';
import prisma from 'server/prisma';

export default class SubscriberAPI {
  public static findMany(
    args: Prisma.SubscriberFindManyArgs,
  ): Promise<Subscriber[]> {
    return prisma.subscriber.findMany(args);
  }

  public static find(
    args: Prisma.SubscriberFindFirstArgs,
  ): Promise<Subscriber | null> {
    return prisma.subscriber.findFirst(args);
  }

  public static create(args: Prisma.SubscriberCreateArgs): Promise<Subscriber> {
    return prisma.subscriber.create(
      immutate(args, { data: { token: { $set: UUIDv4() } } }),
    );
  }

  public static update(args: Prisma.SubscriberUpdateArgs): Promise<Subscriber> {
    return prisma.subscriber.update(args);
  }

  public static async delete(args: Prisma.SubscriberDeleteArgs): Promise<void> {
    await prisma.subscriber.delete(args);
  }

  public static async announce(
    announcement: SubscriberAnnouncement,
    options: NotifyOptions,
  ): Promise<string> {
    const [info] = await Emailer.notifyNewAnnouncement(announcement, options);
    return nodemailer.getTestMessageUrl(info) || '';
  }
}
