import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import type { PostDAO } from 'classes';
import { PostStatic, PostStatus } from 'classes';
import { AlertType, reportError, setAlert } from 'components/alert';
import type { SelectItem } from 'components/form';
import { UIError } from 'constants/errors';
import hooks from 'constants/handlers';
import type { PathDefinition } from 'constants/types';
import * as Utils from 'constants/utils';
import { validatePost } from 'constants/validations';
import PageMetadata from 'fragments/PageMetadata';
import PostForm, { buildPayload } from 'fragments/posts/PostForm';
import { getDomains } from 'pages/api/posts';

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
        handlers={hooks(setPost, post)}
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
  const domains = await getDomains();
  return {
    props: {
      pathDefinition: {
        title: `Add New Post`,
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
