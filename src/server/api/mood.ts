import type { Mood, Prisma } from '@prisma/client';

import prisma from 'server/prisma';

export default class MoodAPI {
  public static findMany(args: Prisma.MoodFindManyArgs): Promise<Mood[]> {
    return prisma.mood.findMany(args);
  }

  public static create(args: Prisma.MoodCreateArgs): Promise<Mood> {
    return prisma.mood.create(args);
  }

  public static update(args: Prisma.MoodUpdateArgs): Promise<Mood> {
    return prisma.mood.update(args);
  }

  public static async delete(args: Prisma.MoodDeleteArgs): Promise<void> {
    await prisma.mood.delete(args);
  }
}
