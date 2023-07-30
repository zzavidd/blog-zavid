import type { Diary, Post } from '@prisma/client';
import { PostType } from '@prisma/client';

export const DOMAINS = {
  [PostType.REVERIE]: { collection: 'reveries', singular: 'reverie' },
  [PostType.EPISTLE]: { collection: 'epistles', singular: 'epistle' },
  [PostType.POEM]: { collection: 'poetry', singular: 'poem' },
  [PostType.MUSING]: { collection: 'musings', singular: 'musing' },
  [PostType.PASSAGE]: { collection: 'passages', singular: 'passage' },
  [PostType.ADDENDUM]: { collection: 'tributes', singular: 'tribute' },
};

export function getDomainFromPostType(post: Post): string {
  return DOMAINS[post.type].collection;
}

export function formatDiaryEntryTitle(
  entry: Diary,
  format: DiaryTitleFormat = DiaryTitleFormat.Full,
): string {
  return format === DiaryTitleFormat.Full
    ? `Diary Entry #${entry.entryNumber}: ${entry.title}`
    : `#${entry.entryNumber}: ${entry.title}`;
}

export enum DiaryTitleFormat {
  Partial,
  Full,
}
