import { capitalize } from '@mui/material';
import type { Diary, Exclusive, Post, Prisma } from '@prisma/client';
import {
  DiaryStatus,
  ExclusiveStatus,
  PostStatus,
  PostType,
} from '@prisma/client';

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
  exclusive: Exclusive | Prisma.ExclusiveCreateInput,
  recipientName?: string | null,
): string {
  return exclusive.content.replaceAll(
    '{subscriber}',
    recipientName || exclusive.endearment || 'subscriber',
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

export function createExclusiveNavigationInfo(
  exclusive: Exclusive | null | undefined,
  index: number,
): NavInfo | null {
  if (!exclusive) return null;

  return {
    headline: `Exclusive #${index}`,
    subline: exclusive.subject,
    href: `/exclusives/${exclusive.slug}`,
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

export function createExclusiveNavigatorParams(
  exclusive: Exclusive,
  op: DateOp,
  safe = false,
): ExclusiveFindInput {
  return {
    select: { subject: true, slug: true },
    orderBy: { date: op === 'gt' ? 'asc' : 'desc' },
    where: {
      date: { [op]: safe ? ZDate.formatISO(exclusive.date) : exclusive.date },
      status: ExclusiveStatus.PUBLISHED,
    },
  };
}

export enum DiaryTitleFormat {
  Partial,
  Full,
}
