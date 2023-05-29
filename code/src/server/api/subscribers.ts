import type { Prisma, Subscriber } from '@prisma/client';
import ImmutabilityHelper from 'immutability-helper';
import { v4 as UUIDv4 } from 'uuid';

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
      ImmutabilityHelper(args, {
        data: { token: { $set: UUIDv4() } },
      }),
    );
  }
}
