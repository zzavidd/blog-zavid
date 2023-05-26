import type { Diary } from '@prisma/client';

declare global {
  export interface DiaryTriplet {
    current: Diary;
    previous: Diary;
    next: Diary;
  }
}
