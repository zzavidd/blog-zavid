import { useQuery } from '@apollo/client';
import React, { useState, useEffect, memo } from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { zDate } from 'zavid-modules';

import { alert } from 'components/alert.js';
import { CloudinaryImage, TRANSFORMATIONS } from 'components/image.js';
import { LazyLoader } from 'components/loader.js';
import { Title } from 'components/text.js';
import { Zoomer } from 'components/transitioner.js';
import { GET_POSTS_QUERY } from 'private/api/queries';
import css from 'styles/Partials.module.scss';

export const RightSidebar = () => {
  const theme = useSelector(({ theme }) => theme);
  const [recentPosts, setRecentPosts] = useState([]);
  const [isLoaded, setLoaded] = useState(false);

  const { data, error: queryError, loading: queryLoading } = useQuery(
    GET_POSTS_QUERY,
    {
      variables: {
        limit: 4,
        sort: {
          field: 'datePublished',
          order: 'DESC'
        }
      }
    }
  );

  useEffect(() => {
    if (queryLoading) return;
    if (queryError) alert.error(queryError);
    setRecentPosts(data ? data.getAllPosts : []);
    setLoaded(true);
  }, [isLoaded, queryLoading]);

  return (
    <Container className={css[`sidebar-${theme}`]}>
      <Title>Recent Posts</Title>
      {recentPosts.map((post, key) => (
        <RecentPost post={post} key={key} />
      ))}
    </Container>
  );
};

const RecentPost = memo(({ post }) => {
  const theme = useSelector(({ theme }) => theme);
  const [isInView, setInView] = useState(false);

  const datePublished = zDate.formatDate(parseInt(post.datePublished), true);
  const link = `/reveries/${post.slug}`;
  return (
    <a href={link}>
      <LazyLoader setInView={setInView}>
        <Zoomer
          determinant={isInView}
          duration={400}
          className={css[`recent-post-unit-${theme}`]}>
          <Title className={css['recent-post-title']}>{post.title}</Title>
          <div>{datePublished}</div>
          <RecentPostImage post={post} />
        </Zoomer>
      </LazyLoader>
    </a>
  );
});

const RecentPostImage = ({ post }) => {
  const theme = useSelector(({ theme }) => theme);
  if (!post.image) return null;
  return (
    <CloudinaryImage
      src={post.image}
      alt={post.title}
      lazy={TRANSFORMATIONS.MEDIUM_WIDE}
      containerClassName={css[`recent-post-image-${theme}`]}
    />
  );
};