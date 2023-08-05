import { capitalize } from '@mui/material';
import type { Diary, Post } from '@prisma/client';
import { DiaryStatus, PostStatus, PostType } from '@prisma/client';

import ZDate from './lib/date';

export const DOMAINS = {
  [PostType.REVERIE]: { collection: 'reveries', singular: 'reverie' },
  [PostType.EPISTLE]: { collection: 'epistles', singular: 'epistle' },
  [PostType.POEM]: { collection: 'poetry', singular: 'poem' },
  [PostType.MUSING]: { collection: 'musings', singular: 'musing' },
  [PostType.PASSAGE]: { collection: 'passages', singular: 'passage' },
  [PostType.ADDENDUM]: { collection: 'tributes', singular: 'tribute' },
};

/**
 * @deprecated
 */
export function getDomainFromPostType(post: Post): string {
  return DOMAINS[post.type].collection;
}

export function embedSubscriber(
  announcement: SubscriberAnnouncement,
  recipientName: string | null,
): string {
  return announcement.content.replaceAll(
    '{subscriber}',
    recipientName ?? announcement.endearment ?? 'subscriber',
  );
}

export function formatDiaryEntryTitle(
  entry: Diary,
  format: DiaryTitleFormat = DiaryTitleFormat.Full,
): string {
  return format === DiaryTitleFormat.Full
    ? `Diary Entry #${entry.entryNumber}: ${entry.title}`
    : `#${entry.entryNumber}: ${entry.title}`;
}

export function createDiaryNavigationInfo(
  entry?: Diary | DiaryWithCategories | null,
): NavInfo | null {
  return entry
    ? {
        headline: `Diary Entry #${entry.entryNumber}`,
        subline: entry.title,
        href: `/diary/${entry.entryNumber}`,
      }
    : null;
}

export function createPostNavigationInfo(
  post: Post | null | undefined,
  index: number,
): NavInfo | null {
  if (!post) return null;

  const domain = DOMAINS[post.type];
  const singular = capitalize(domain.singular);
  return {
    headline: `${singular} #${index}`,
    subline: post.title,
    href: `/${domain.collection}/${post.slug}`,
  };
}

export function createDiaryNavigatorParams(
  entryNumber: number,
): DiaryFindInput {
  return {
    params: {
      where: {
        entryNumber,
        status: { in: [DiaryStatus.PRIVATE, DiaryStatus.PUBLISHED] },
      },
      select: { title: true, entryNumber: true },
    },
  };
}

export function createPostNavigatorParams(
  post: Post,
  op: DateOp,
  safe = false,
): PostFindInput {
  return {
    params: {
      select: { title: true, type: true, slug: true },
      orderBy: { datePublished: op === 'gt' ? 'asc' : 'desc' },
      where: {
        datePublished: {
          [op]: safe ? ZDate.formatISO(post.datePublished) : post.datePublished,
        },
        status: { in: [PostStatus.PRIVATE, PostStatus.PUBLISHED] },
        type: post.type,
      },
    },
  };
}

export enum DiaryTitleFormat {
  Partial,
  Full,
}
