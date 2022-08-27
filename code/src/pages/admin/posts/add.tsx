import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import type { PostDAO, PostType, ReactSelectChangeEvent } from 'classes';
import { PostStatic, PostStatus } from 'classes';
import { AlertType, reportError, setAlert } from 'components/alert';
import type { SelectItem } from 'components/form';
import type { PathDefinition } from 'constants/paths';
import * as Utils from 'constants/utils';
import PageMetadata from 'fragments/PageMetadata';
import { UIError } from 'lib/errors';
import hooks from 'lib/hooks';
import PostForm, { buildPayload } from 'lib/pages/posts/form';
import { validatePost } from 'lib/validations';
import { getAllPosts } from 'pages/api/posts';

// eslint-disable-next-line react/function-component-definition
const PostAdd: NextPage<PostAddProps> = ({ pathDefinition, pageProps }) => {
  const { domains } = pageProps;
  const router = useRouter();

  const [post, setPost] = useState<PostDAO>({
    title: '',
    content: '',
    type: undefined,
    typeId: undefined,
    excerpt: '',
    image: {
      source: '',
      hasChanged: false,
    },
    contentImages: {},
    status: PostStatus.DRAFT,
    datePublished: undefined,
    domainId: undefined,
  });
  const [isRequestPending, setRequestPending] = useState(false);

  // Determine if post is being published.
  const isPublish = PostStatic.isPublish(post);

  function onTypeChange(e: ReactSelectChangeEvent) {
    const selectedType = e.target.value as PostType;
    const postsOfType = domains.filter(({ type, status }) => {
      return selectedType === type && status != PostStatus.DRAFT;
    });
    const newTypeId = postsOfType.length + 1;
    const typeId = PostStatic.isDraft(post) ? undefined : newTypeId;

    setPost({
      ...post,
      type: selectedType,
      typeId,
    });
  }

  function onStatusChange(e: ReactSelectChangeEvent) {
    const selectedStatus = e.target.value as PostStatus;
    const postsOfType = domains.filter(({ type, status }) => {
      return post.type === type && status != PostStatus.DRAFT;
    });
    const newTypeId = postsOfType.length + 1;
    const typeId = selectedStatus === PostStatus.DRAFT ? undefined : newTypeId;

    setPost({
      ...post,
      status: selectedStatus,
      typeId,
    });
  }

  /** Create new post on server. */
  async function submitPost() {
    try {
      setRequestPending(true);
      validatePost(post);

      const payload = buildPayload(post, isPublish, true);
      await Utils.request('/api/posts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setAlert({
        type: AlertType.SUCCESS,
        message: `You've successfully added the new post titled "${post.title}".`,
      });
      returnToPostAdmin();
    } catch (e: any) {
      reportError(e.message, e instanceof UIError);
    } finally {
      setRequestPending(false);
    }
  }

  function returnToPostAdmin() {
    void router.push('/admin/posts');
  }

  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <PostForm
        post={post}
        domains={domains}
        isCreateOperation={true}
        handlers={{ ...hooks(setPost, post), onTypeChange, onStatusChange }}
        confirmFunction={submitPost}
        confirmButtonText={'Submit'}
        cancelFunction={returnToPostAdmin}
        isRequestPending={isRequestPending}
      />
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps<
  PostAddProps
> = async () => {
  const domains = (
    await getAllPosts({
      sort: {
        field: 'type',
        order: 'DESC',
      },
    })
  ).map(({ id, title, type, status }: PostDAO) => {
    return {
      value: id!.toString(),
      label: `${type}: ${title}`,
      type,
      status,
    };
  });

  return {
    props: {
      pathDefinition: {
        title: `Add New Diary Entry`,
      },
      pageProps: {
        domains,
      },
    },
  };
};

export default PostAdd;

interface PostAddProps {
  pathDefinition: PathDefinition;
  pageProps: {
    domains: (PostDAO & SelectItem)[];
  };
}
