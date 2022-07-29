import { useQuery } from '@apollo/client';
import React, { memo, useEffect, useState } from 'react';
import type { RootStateOrAny } from 'react-redux';
import { useSelector } from 'react-redux';
import { zDate } from 'zavid-modules';

import type { PostDAO } from 'classes';
import { PostStatic } from 'classes';
import { alert } from 'src/components/alert';
import CloudImage from 'src/components/image';
import { Title, VanillaLink } from 'src/components/text';
import { GET_POSTS_QUERY } from 'src/private/api/queries/post.queries';
import css from 'src/styles/Partials.module.scss';

export const RightSidebar = () => {
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  const [recentPosts, setRecentPosts] = useState([]);
  const [isLoaded, setLoaded] = useState(false);

  const {
    data,
    error: queryError,
    loading: queryLoading,
  } = useQuery(GET_POSTS_QUERY, {
    variables: {
      limit: 4,
      sort: {
        field: 'datePublished',
        order: 'DESC',
      },
      type: { exclude: [PostStatic.TYPE.PAGE] },
      status: { include: [PostStatic.STATUS.PUBLISHED] },
    },
  });

  useEffect(() => {
    if (queryLoading) return;
    if (queryError) alert.error(queryError);
    setRecentPosts(data ? data.getAllPosts : []);
    setLoaded(true);
  }, [isLoaded, queryLoading]);

  return (
    <div className={css[`sidebar-${theme}`]}>
      <Title className={css[`sidebar-title`]}>Recent Posts</Title>
      {recentPosts.map((post, key) => (
        <RecentPost post={post} key={key} />
      ))}
    </div>
  );
};

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

const RecentPostImage = ({ post }: RecentPostProps) => {
  if (!post.image) return null;
  const theme = useSelector(({ theme }: RootStateOrAny) => theme);
  return (
    <CloudImage
      src={post.image as string}
      alt={post.title}
      containerClassName={css[`recent-post-image-${theme}`]}
    />
  );
};

interface RecentPostProps {
  post: PostDAO;
}
