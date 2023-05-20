import Link from 'next/link';
import React from 'react';

import { PostStatic } from 'classes/posts/PostStatic';
import Loader from 'components/Loader';
import ZDate from 'lib/date';
import * as Style from 'styles/Pages/Home.styles';

export default function HomeRandomPosts({ posts = [] }: RandomPostsGridProps) {
  return (
    <React.Fragment>
      <Style.Aside.HeadingBox>
        <Style.Aside.Heading>
          A random selection of posts to trigger the taste buds...
        </Style.Aside.Heading>
      </Style.Aside.HeadingBox>
      <Style.Aside.PostList>
        {posts.length
          ? posts.map((post) => {
              const directory = PostStatic.getDirectory(post.type!);
              return (
                <Style.Aside.Post key={post.id}>
                  <Link href={`/${directory}/${post.slug}`}>
                    <Style.Aside.ImageBox>
                      <Style.Aside.Image
                        src={post.image as string}
                        alt={post.title}
                        placeholder={'blur'}
                        blurDataURL={post.imagePlaceholder}
                        loading={'lazy'}
                      />
                    </Style.Aside.ImageBox>
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
            })
          : Array(4)
              .fill(null)
              .map((_, key) => {
                return (
                  <Loader viewBox={'0 0 50 40'} key={key}>
                    <rect x={0} y={0} rx={3} width={50} height={28} />
                    <rect x={0} y={32} rx={1} width={30} height={2} />
                    <rect x={0} y={36} rx={1} width={30} height={2} />
                  </Loader>
                );
              })}
      </Style.Aside.PostList>
    </React.Fragment>
  );
}

interface RandomPostsGridProps {
  posts: PostDAO[];
}
