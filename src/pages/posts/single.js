import React from 'react';

import { BackButton } from 'components/button';
import { CloudinaryImage } from 'components/image';
import { Spacer, Toolbar } from 'components/layout';
import { Paragraph, Title } from 'components/text';
import css from 'styles/pages/Posts.module.scss';

const Post = ({ post }) => {
  return (
    <Spacer>
    <div className={css['post-single']}>
      <Title className={css['post-single-title']}>{post.title}</Title>
      <div>{post.datePublished}</div>
      <CloudinaryImage
        src={post.image}
        containerClassName={css['post-single-image-container']}
        imageClassName={css['post-single-image']}
      />
      <div className={css['post-single-content']}>
        <Paragraph cssOverrides={{
          blockquote: css['content-blockquotes']
        }}>{post.content}</Paragraph>
      </div>
    </div>
    <Toolbar>
      <BackButton>Back to Reveries</BackButton>
    </Toolbar>
    </Spacer>
  );
};

Post.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default Post;
