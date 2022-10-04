import React, { useState } from 'react';
import { zDate } from 'zavid-modules';

import { PostBuilder } from 'classes/posts/PostBuilder';
import type { PostType, PostDAO } from 'classes/posts/PostDAO';
import { PostStatic } from 'classes/posts/PostStatic';
import { AdminButton, BackButton as IBackButton } from 'components/button';
import { Curator } from 'components/curator';
import CloudImage, { SignatureImage } from 'components/image';
import { Spacer, Toolbar } from 'components/layout';
import ShareBlock from 'components/share';
import { Divider, Paragraph, Title } from 'components/text';
import Timeline, { TimelineType } from 'components/timeline';
import { CLOUDINARY_BASE_URL } from 'constants/settings';
import type { Substitutions } from 'constants/types';
import AdminLock from 'fragments/AdminLock';
import { CuratePrompt } from 'fragments/shared/CuratePrompt';
import css from 'styles/pages/Posts.module.scss';

export default function PostTemplatePage({
  current: post,
  previous: previousPost = new PostBuilder().build(),
  next: nextPost = new PostBuilder().build(),
}: PostTemplatePageProps) {
  const [isImageModalVisible, setImageModalVisibility] = useState(false);
  const [isCuratePromptVisible, setCuratePromptVisible] = useState(false);
  const [curatePromptRef, setCuratePromptRef] = useState<HTMLElement>();
  const [imageContent, setImageContent] = useState('');

  const shareMessage = `"${post.title}" on ZAVID`;

  const substitutions: Substitutions = {};
  const contentImages = JSON.parse(post.contentImages as string) || [];
  contentImages.forEach((image: string, key: number) => {
    substitutions[`image${key + 1}`] = `![](${CLOUDINARY_BASE_URL}/${image})`;
  });

  const sourceTitle = PostStatic.isPage(post)
    ? `${post.domainTitle}: ${post.title}`
    : `${post.type} #${post.typeId}: ${post.title}`;

  return (
    <React.Fragment>
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
            alt={post.title}
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
          <SignatureImage />
          <Timeline
            type={getTimelineType(post.type!)!}
            previous={{
              slug: previousPost.slug!,
              image: previousPost.image as string,
              label: PostStatic.getPostTitle(previousPost),
            }}
            next={{
              slug: nextPost.slug!,
              image: nextPost.image as string,
              label: PostStatic.getPostTitle(nextPost),
            }}
          />
          <Divider />
          <ShareBlock message={shareMessage} url={location.href} />
        </div>
        <Toolbar spaceItems={true} hasBackButton={true}>
          <BackButton post={post} />
          <AdminLock>
            <AdminButton onClick={() => navigateToEdit(post.id!)}>
              Edit {post.type}
            </AdminButton>
          </AdminLock>
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
    </React.Fragment>
  );
}

function BackButton({ post }: BackButtonProps) {
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
}

function PostDate({ post }: PostDate) {
  if (!post || !post.datePublished) return null;
  if (PostStatic.isPrivate(post)) return null;

  const datePublished = zDate.formatDate(post.datePublished as string, {
    withWeekday: true,
  });
  return <div className={css['post-single-date']}>{datePublished}</div>;
}

function getTimelineType(type: PostType) {
  return Object.values(TimelineType).find(({ label }) => label === type);
}

function navigateToEdit(id: number): void {
  location.href = `/admin/posts/edit/${id}`;
}

export interface PostTemplatePageProps {
  current: PostDAO;
  next?: PostDAO;
  previous?: PostDAO;
}

interface PostDate {
  post: PostDAO;
}

interface BackButtonProps {
  post: PostDAO;
}
