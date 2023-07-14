import type { Post } from '@prisma/client';
import { PostType } from '@prisma/client';

export function getDomainFromPostType(post: Post): string {
  if (post.type === PostType.PASSAGE) {
    return 'passages';
  }
  return post.type;
}
