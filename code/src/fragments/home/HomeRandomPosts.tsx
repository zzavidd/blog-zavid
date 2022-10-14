import Link from 'next/link';
import React from 'react';

import type { PostDAO } from 'classes/posts/PostDAO';
import { PostStatic } from 'classes/posts/PostStatic';
import ZDate from 'lib/date';
import * as Style from 'stylesv2/Pages/Home.styles';

export default function HomeRandomPosts({ posts }: RandomPostsGridProps) {
  return (
    <React.Fragment>
      <Style.Aside.HeadingBox>
        <Style.Aside.Heading>
          A random selection of posts to trigger the taste buds...
        </Style.Aside.Heading>
      </Style.Aside.HeadingBox>
      <Style.Aside.PostList>
        {posts.map((post) => {
          const directory = PostStatic.getDirectory(post.type!);
          return (
            <Style.Aside.Post key={post.id}>
              <Link href={`/${directory}/${post.slug}`} passHref={true}>
                <a>
                  <Style.Aside.ImageBox>
                    <Style.Aside.Image
                      src={post.image as string}
                      alt={post.title}
                      layout={'fill'}
                      objectFit={'cover'}
                      loading={'lazy'}
                    />
                  </Style.Aside.ImageBox>
                </a>
              </Link>
              <Style.Aside.PostDetailsBox>
                <Style.Aside.PostTitle>
                  {PostStatic.getPostTitle(post)}
                </Style.Aside.PostTitle>
                <Style.Aside.PostMetadata>
                  {post.type}&nbsp;&#x2022;&nbsp;
                  <time dateTime={ZDate.formatISO(post.datePublished)}>
                    {ZDate.format(post.datePublished)}
                  </time>
                </Style.Aside.PostMetadata>
              </Style.Aside.PostDetailsBox>
            </Style.Aside.Post>
          );
        })}
      </Style.Aside.PostList>
    </React.Fragment>
  );
}

interface RandomPostsGridProps {
  posts: PostDAO[];
}
