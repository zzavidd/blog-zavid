import type { Prisma, Subscriber } from '@prisma/client';
import { v4 as UUIDv4 } from 'uuid';

import prisma from 'server/prisma';

export default class SubscriberAPI {
  public static findMany(
    payload: Prisma.SubscriberWhereInput,
  ): Promise<Subscriber[]> {
    return prisma.subscriber.findMany({ where: payload });
  }
  public static find(
    payload: Prisma.SubscriberWhereInput,
  ): Promise<Subscriber> {
    return prisma.subscriber.findFirstOrThrow({ where: payload });
  }

  public static create(payload: CreateSubscriberPayload) {
    return prisma.subscriber.create({
      data: { ...payload, token: UUIDv4() },
    });
  }
}
