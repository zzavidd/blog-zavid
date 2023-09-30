import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL?.replace('_dev', ''),
    },
  },
});

const subscribers = await prisma.subscriber.findMany();
const queries = subscribers.map((subscriber) => {
  const subscriptions = subscriber.subscriptions as SubscriptionMap;
  return prisma.subscriber.update({
    data: {
      subscriptions: {
        ...subscriptions,
        Exclusives: subscriptions.Diary,
      },
    },
    where: { id: subscriber.id },
  });
});

await prisma.$transaction(queries);
