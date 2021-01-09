import { NextPageContext } from 'next';
import React, { useState } from 'react';
import { zDate } from 'zavid-modules';

import { PostDAO, PostStatic, PostType, Substitutions } from 'classes';
import { AdminButton, BackButton as IBackButton } from 'src/components/button';
import { Curator } from 'src/components/curator';
import CloudImage, { cloudinaryBaseUrl, Signature } from 'src/components/image';
import { Spacer, Toolbar } from 'src/components/layout';
import ShareBlock from 'src/components/share';
import { Divider, Paragraph, Title } from 'src/components/text';
import Timeline, { TimelineType } from 'src/components/timeline';
import { isAuthenticated } from 'src/lib/cookies';
import { CuratePrompt } from 'src/lib/pages/posts/prompt';
import { DAOParse } from 'src/lib/parser';
import css from 'src/styles/pages/Posts.module.scss';

const PostSingle = ({ post, previousPost = {}, nextPost = {} }: PostSingle) => {
  const [isImageModalVisible, setImageModalVisibility] = useState(false);
  const [isCuratePromptVisible, setCuratePromptVisible] = useState(false);
  const [curatePromptRef, setCuratePromptRef] = useState<HTMLElement>();
  const [imageContent, setImageContent] = useState('');

  const shareMessage = `"${post.title}" on ZAVID`;

  const substitutions: Substitutions = {};
  const contentImages = JSON.parse(post.contentImages as string) || [];
  contentImages.forEach((image: string, key: number) => {
    substitutions[`image${key + 1}`] = `![](${cloudinaryBaseUrl}/${image})`;
  });

  const sourceTitle = PostStatic.isPage(post)
    ? `${post.domainTitle}: ${post.title}`
    : `${post.type} #${post.typeId}: ${post.title}`;

  return (
    <>
      <Spacer>
        <div className={css['post-single']}>
          <Title className={css['post-single-title']}>
            {PostStatic.getPostTitle(post)}
          </Title>
          <PostDate post={post} />
          <CloudImage
            src={post.image as string}
            containerClassName={css['post-single-image-container']}
            imageClassName={css['post-single-image']}
          />
          <Paragraph
            className={css['post-single-content']}
            substitutions={substitutions}
            onLongPress={(target: HTMLElement) => {
              setImageContent(target.innerText);
              setCuratePromptRef(target);
              setCuratePromptVisible(true);
            }}>
            {post.content}
          </Paragraph>
          <Signature />
          <Timeline
            type={getTimelineType(post.type!)!}
            previous={{
              slug: previousPost.slug!,
              image: previousPost.image as string,
              label: PostStatic.getPostTitle(previousPost)
            }}
            next={{
              slug: nextPost.slug!,
              image: nextPost.image as string,
              label: PostStatic.getPostTitle(nextPost)
            }}
          />
          <Divider />
          <ShareBlock message={shareMessage} url={location.href} />
        </div>
        <Toolbar spaceItems={true} hasBackButton={true}>
          <BackButton post={post} />
          {isAuthenticated() && (
            <AdminButton onClick={() => navigateToEdit(post.id!)}>
              Edit {post.type}
            </AdminButton>
          )}
        </Toolbar>
      </Spacer>
      <Curator
        visible={isImageModalVisible}
        closeFunction={() => setImageModalVisibility(false)}
        sourceTitle={sourceTitle}
        content={imageContent}
      />
      <CuratePrompt
        target={curatePromptRef!}
        visible={isCuratePromptVisible}
        onHide={() => setCuratePromptVisible(false)}
        onClick={() => {
          setImageModalVisibility(true);
          setCuratePromptVisible(false);
        }}
      />
    </>
  );
};

const BackButton = ({ post }: BackButtonProps) => {
  const goBack = () => {
    let url;
    if (PostStatic.isPage(post)) {
      const basePath = PostStatic.getDirectory(post.domainType!);
      url = `/${basePath}/${post.domainSlug}`;
    } else {
      url = `/${PostStatic.getDirectory(post.type!)}`;
    }

    location.href = url;
  };

  let buttonText = 'Back to ';
  if (!PostStatic.isPage(post)) {
    buttonText += `${post.type}s`;
  } else {
    buttonText += post.domainTitle;
  }

  return <IBackButton onClick={goBack}>{buttonText}</IBackButton>;
};

const getTimelineType = (type: PostType) => {
  return Object.values(TimelineType).find(({ label }) => label === type);
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

type BackButtonProps = {
  post: PostDAO;
};
