import { NextPageContext } from 'next';
import React from 'react';
import { zDate } from 'zavid-modules';

import { PostDAO, PostStatic, Substitutions } from 'classes';
import { BackButton, AdminButton } from 'src/components/button';
import CloudImage, { cloudinaryBaseUrl, Signature } from 'src/components/image';
import { Spacer, Toolbar } from 'src/components/layout';
import ShareBlock from 'src/components/share';
import { Paragraph, Title, Divider } from 'src/components/text';
import Timeline, { TimelineType } from 'src/components/timeline';
import { isAuthenticated } from 'src/lib/cookies';
import { DAOParse } from 'src/lib/parser';
import css from 'src/styles/pages/Posts.module.scss';

const PostSingle = ({ post, previousPost = {}, nextPost = {} }: PostSingle) => {
  const shareMessage = `"${post.title}" on ZAVID`;

  const substitutions: Substitutions = {};
  const contentImages = JSON.parse(post.contentImages as string) || [];
  contentImages.forEach((image: string, key: number) => {
    substitutions[`image${key + 1}`] = `![](${cloudinaryBaseUrl}/${image})`;
  });

  return (
    <Spacer>
      <div className={css['post-single']}>
        <Title className={css['post-single-title']}>{post.title}</Title>
        <PostDate post={post} />
        <CloudImage
          src={post.image as string}
          containerClassName={css['post-single-image-container']}
          imageClassName={css['post-single-image']}
        />
        <Paragraph
          className={css['post-single-content']}
          substitutions={substitutions}>
          {post.content}
        </Paragraph>
        <Signature />
        <Timeline
          type={TimelineType.REVERIE}
          previous={{
            slug: previousPost.slug!,
            image: previousPost.image as string,
            label: previousPost.title
          }}
          next={{
            slug: nextPost.slug!,
            image: nextPost.image as string,
            label: nextPost.title
          }}
        />
        <Divider />
        <ShareBlock message={shareMessage} url={location.href} />
      </div>
      <Toolbar spaceItems={true} hasBackButton={true}>
        <BackButton onClick={navigateToReveries}>Back to Reveries</BackButton>
        {isAuthenticated() && (
          <AdminButton onClick={() => navigateToEdit(post.id!)}>
            Edit Reverie
          </AdminButton>
        )}
      </Toolbar>
    </Spacer>
  );
};

const navigateToReveries = (): void => {
  location.href = '/reveries';
};
const navigateToEdit = (id: number): void => {
  location.href = `/admin/posts/edit/${id}`;
};

const PostDate = ({ post }: PostDate) => {
  if (!post || !post.datePublished) return null;
  if (PostStatic.isPrivate(post)) return null;

  const datePublished = zDate.formatDate(post.datePublished as string, {
    withWeekday: true
  });
  return <div className={css['post-single-date']}>{datePublished}</div>;
};

PostSingle.getInitialProps = async ({ query }: NextPageContext) => {
  const post = DAOParse<PostDAO>(query.post);
  const previousPost = DAOParse<PostDAO>(query.previousPost);
  const nextPost = DAOParse<PostDAO>(query.nextPost);
  return { post, previousPost, nextPost };
};

export default PostSingle;

interface PostSingle {
  post: PostDAO;
  nextPost: PostDAO;
  previousPost: PostDAO;
}

interface PostDate {
  post: PostDAO;
}
