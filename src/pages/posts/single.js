import React from 'react';
import { zDate, zLogic } from 'zavid-modules';

import { Post } from 'classes';
import { BackButton } from 'components/button';
import CloudImage, { cloudinaryBaseUrl } from 'components/image';
import { Spacer, Toolbar } from 'components/layout';
import ShareBlock from 'components/share';
import { Paragraph, Title, Divider } from 'components/text';
import css from 'styles/pages/Posts.module.scss';

const PostSingle = ({ post }) => {
  const shareMessage = `"${post.title}" on ZAVID`;

  const navigateBack = () => (location.href = '/reveries');

  const substitutions = {};
  const contentImages = post.contentImages || [];

  contentImages.forEach(({ image }, key) => {
    substitutions[`image${key + 1}`] = `![](${cloudinaryBaseUrl}/${image})`;
  });
  return (
    <Spacer>
      <div className={css['post-single']}>
        <Title className={css['post-single-title']}>{post.title}</Title>
        <PostDate post={post} />
        <CloudImage
          src={post.image}
          containerClassName={css['post-single-image-container']}
          imageClassName={css['post-single-image']}
        />
        <Paragraph
          className={css['post-single-content']}
          substitutions={substitutions}>
          {post.content}
        </Paragraph>
        <Divider />
        <ShareBlock message={shareMessage} url={location.href} />
      </div>
      <Toolbar>
        <BackButton onClick={navigateBack}>Back to Reveries</BackButton>
      </Toolbar>
    </Spacer>
  );
};

const PostDate = ({ post }) => {
  if (zLogic.isFalsy(post, post.datePublished)) return null;
  if (Post.isPrivate(post)) return null;

  const datePublished = zDate.formatDate(post.datePublished, true);
  return <div className={css['post-single-date']}>{datePublished}</div>;
};

PostSingle.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default PostSingle;
