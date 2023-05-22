import type { Prisma, Subscriber } from '@prisma/client';
import { v4 as UUIDv4 } from 'uuid';

import prisma from 'server/prisma';

namespace SubscriberAPI {
  export function findMany(
    payload: Prisma.SubscriberWhereInput,
  ): Promise<Subscriber[]> {
    return prisma.subscriber.findMany({ where: payload });
  }
  export function find(
    payload: Prisma.SubscriberWhereInput,
  ): Promise<Subscriber> {
    return prisma.subscriber.findFirstOrThrow({ where: payload });
  }

  export async function create(payload: CreateSubscriberPayload) {
    await prisma.subscriber.create({
      data: { ...payload, token: UUIDv4() },
    });
  }
}

export default SubscriberAPI;
