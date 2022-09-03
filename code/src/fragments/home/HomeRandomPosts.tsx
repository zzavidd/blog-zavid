import React, { useEffect, useState } from 'react';
import { zDate } from 'zavid-modules';

import type { PostDAO } from 'classes/posts/PostDAO';
import { PostStatic } from 'classes/posts/PostStatic';
import CloudImage, { AspectRatio } from 'components/image';
import { Title, VanillaLink } from 'components/text';
import css from 'styles/pages/Home.module.scss';

export default function HomeRandomPosts({ posts }: RandomPostsGridProps) {
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, [isLoaded]);

  return (
    <div className={css['random-posts-wrapper']}>
      <Title className={css['random-posts-heading']}>
        A random selection of posts to trigger the taste buds...
      </Title>
      <div className={css['random-posts-grid']}>
        {posts.map((post, key) => {
          const directory = PostStatic.getDirectory(post.type!);
          return (
            <div className={css['random-post-unit']} key={key}>
              <VanillaLink href={`/${directory}/${post.slug}`}>
                <CloudImage
                  src={post.image as string}
                  containerClassName={css['random-post-image-wrapper']}
                  imageClassName={css['random-post-image']}
                  aspectRatio={AspectRatio.WIDE}
                  alt={post.title}
                />
                <Title className={css['random-post-title']}>
                  {PostStatic.getPostTitle(post)}
                </Title>
                <div className={css['random-post-date']}>
                  {post.type} |{' '}
                  {zDate.formatDate(post.datePublished!, { withWeekday: true })}
                </div>
              </VanillaLink>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface RandomPostsGridProps {
  posts: PostDAO[];
}
