import { memo, useEffect, useState } from 'react';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';
import { zDate } from 'zavid-modules';

import type { PostDAO } from 'classes';
import { PostStatic } from 'classes';
import CloudImage from 'components/image';
import { Title, VanillaLink } from 'components/text';
import * as Utils from 'constants/utils';
import css from 'styles/Partials.module.scss';

export function RightSidebar() {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);

  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const query = new URLSearchParams({
        params: JSON.stringify({
          limit: 4,
          sort: {
            field: 'datePublished',
            order: 'DESC',
          },
          type: { exclude: [PostStatic.TYPE.PAGE] },
          status: { include: [PostStatic.STATUS.PUBLISHED] },
        }),
      });

      try {
        const data = await Utils.request(`/api/posts?${query.toString()}`);
        setRecentPosts(data);
      } catch (e: any) {
        reportError(e.message);
      }
    })();
  }, []);

  return (
    <div className={css[`sidebar-${theme}`]}>
      <Title className={css[`sidebar-title`]}>Recent Posts</Title>
      {recentPosts.map((post, key) => (
        <RecentPost post={post} key={key} />
      ))}
    </div>
  );
}

const RecentPost = memo(({ post }: RecentPostProps) => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const datePublished = zDate.formatDate(post.datePublished as string, {
    withWeekday: true,
  });
  const link = `/reveries/${post.slug}`;

  return (
    <VanillaLink href={link}>
      <div className={css[`recent-post-unit-${theme}`]}>
        <RecentPostImage post={post} />
        <Title className={css['recent-post-title']}>{post.title}</Title>
        <div className={css['recent-post-date']}>
          {post.type} | {datePublished}
        </div>
      </div>
    </VanillaLink>
  );
});
function RecentPostImage({ post }: RecentPostProps) {
  if (!post.image) return null;
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  return (
    <CloudImage
      src={post.image as string}
      alt={post.title}
      containerClassName={css[`recent-post-image-${theme}`]}
    />
  );
}

interface RecentPostProps {
  post: PostDAO;
}
