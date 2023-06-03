import { PrismaClient } from '@prisma/client';

import Emailer from '../src/server/emails';

const prisma = new PrismaClient();

(async () => {
  try {
    const diaryEntry = await prisma.diary.findFirstOrThrow();
    await Emailer.notifyNewDiaryEntry(diaryEntry);
  } catch (e) {
    console.error('No diary entry exists.');
  } finally {
    process.exit(0);
  }
})();
