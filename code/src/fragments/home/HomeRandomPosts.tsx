import { Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import React from 'react';

import { PostStatic } from 'classes/posts/PostStatic';
import { Link } from 'componentsv2/Link';
import { Time } from 'componentsv2/Typography/Time';

export default function HomeRandomPosts({ posts = [] }: RandomPostsGridProps) {
  return (
    <React.Fragment>
      <Typography variant={'h6'}>
        A random selection of posts to trigger the taste buds...
      </Typography>
      <Stack>
        {posts.map((post) => {
          const directory = PostStatic.getDirectory(post.type!);
          return (
            <Card key={post.id}>
              <Link href={`/${directory}/${post.slug}`}>
                <CardMedia src={post.image as string} />
              </Link>
              <CardContent>
                <Typography variant={'h6'}>
                  {PostStatic.getPostTitle(post)}
                </Typography>
                <Stack direction={'row'} divider={'&#x2022;'}>
                  <Typography variant={'body1'}>{post.type}</Typography>
                  <Time date={post.datePublished!} />
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </React.Fragment>
  );
}

interface RandomPostsGridProps {
  posts: PostDAO[];
}
