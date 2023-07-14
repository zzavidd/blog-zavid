import type { Post } from '@prisma/client';
import { PostType } from '@prisma/client';

const DOMAINS = {
  [PostType.REVERIE]: { collection: 'reveries' },
  [PostType.EPISTLE]: { collection: 'epistles' },
  [PostType.POEM]: { collection: 'poetry' },
  [PostType.MUSING]: { collection: 'musings' },
  [PostType.PASSAGE]: { collection: 'passages' },
};

export function getDomainFromPostType(post: Post): string {
  if (post.type === PostType.ADDENDUM) {
    return '';
  }
  return DOMAINS[post.type].collection;
}
