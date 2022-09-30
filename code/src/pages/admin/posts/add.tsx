import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import type { PostDAO } from 'classes/posts/PostDAO';
import { PostStatus } from 'classes/posts/PostDAO';
import { PostStatic } from 'classes/posts/PostStatic';
import type { SelectItem } from 'components/form';
import Alert, { AlertType } from 'constants/alert';
import hooks from 'constants/handlers';
import type { NextPageWithLayout, PathDefinition } from 'constants/types';
import Utils from 'constants/utils';
import Validate from 'constants/validations';
import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import PageMetadata from 'fragments/PageMetadata';
import PostForm, { buildPayload } from 'fragments/posts/PostForm';
import PostAPI from 'private/api/posts';

// eslint-disable-next-line react/function-component-definition
const PostAdd: NextPageWithLayout<PostAddProps> = ({
  pathDefinition,
  pageProps,
}) => {
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
  const isPublish = PostStatic.isPublished(post);

  /** Create new post on server. */
  async function submitPost() {
    try {
      setRequestPending(true);
      Validate.post(post);

      const payload = buildPayload(post, isPublish, true);
      await Utils.request('/api/posts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      Alert.set({
        type: AlertType.SUCCESS,
        message: `You've successfully added the new post titled "${post.title}".`,
      });
      returnToPostAdmin();
    } catch (e: any) {
      Alert.error(e.message);
    } finally {
      setRequestPending(false);
    }
  }

  function returnToPostAdmin() {
    void router.push('/admin/posts');
  }

  return (
    <AdminGateway>
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
    </AdminGateway>
  );
};

export const getServerSideProps: GetServerSideProps<
  PostAddProps
> = async () => {
  const domains = await PostAPI.getDomains();
  return {
    props: {
      pathDefinition: {
        title: 'Add New Post',
      },
      pageProps: {
        domains,
      },
    },
  };
};

PostAdd.getLayout = Layout.addHeaderOnly;
export default PostAdd;

interface PostAddProps {
  pathDefinition: PathDefinition;
  pageProps: {
    domains: (PostDAO & SelectItem)[];
  };
}
