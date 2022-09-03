import type { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { URLBuilder } from 'classes/_/URLBuilder';
import type {
  PostDAO,
  PostImage,
  PostContentImageMapping,
} from 'classes/posts/PostDAO';
import { PostStatic } from 'classes/posts/PostStatic';
import { AlertType, reportError, setAlert } from 'components/alert';
import type { SelectItem } from 'components/form';
import { UIError } from 'constants/errors';
import hooks from 'constants/handlers';
import { DOMAIN } from 'constants/settings';
import type { PathDefinition } from 'constants/types';
import * as Utils from 'constants/utils';
import { validatePost } from 'constants/validations';
import PageMetadata from 'fragments/PageMetadata';
import PostForm, { buildPayload } from 'fragments/posts/PostForm';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import PostAPI from 'private/api/posts';
import SSR from 'private/ssr';

// eslint-disable-next-line react/function-component-definition
const PostEdit: NextPage<PostEditProps> = ({ pathDefinition, pageProps }) => {
  const { post: serverPost, domains } = pageProps;
  const router = useRouter();

  const [clientPost, setPost] = useState<PostDAO>(serverPost);
  const [isRequestPending, setRequestPending] = useState(false);

  // Determine if post is being published.
  const isPublish = PostStatic.isPublished(clientPost);

  /** Update post on server. */
  const updatePost = async (): Promise<void> => {
    try {
      validatePost(clientPost);
      setRequestPending(true);

      const payload = buildPayload(clientPost, isPublish, false);
      await Utils.request('/api/posts', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      setAlert({
        type: AlertType.SUCCESS,
        message: `You've successfully updated "${clientPost.title}".`,
      });
      returnAfterUpdate();
    } catch (e: any) {
      reportError(e.message, e instanceof UIError);
    } finally {
      setRequestPending(false);
    }
  };

  /** Return to the admin page. */
  function returnToPostAdmin() {
    void router.push('/admin/posts');
  }

  const returnAfterUpdate = () => {
    const url = new URLBuilder();
    url.append(DOMAIN);

    if (PostStatic.isPage(clientPost)) {
      const base = PostStatic.getDirectory(clientPost.domainType!);
      url.appendSegment(base);
      url.appendSegment(clientPost.domainSlug!);
      url.appendSegment(clientPost.slug!);
    } else {
      const base = PostStatic.getDirectory(clientPost.type!);
      url.appendSegment(base);
      url.appendSegment(clientPost.slug!);
    }

    const postUrl = url.build();

    if (document.referrer === postUrl) {
      location.href = postUrl;
    } else {
      returnToPostAdmin();
    }
  };

  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <PostForm
        post={clientPost}
        domains={domains}
        isCreateOperation={false}
        handlers={hooks(setPost, clientPost)}
        confirmFunction={updatePost}
        confirmButtonText={'Update'}
        cancelFunction={returnToPostAdmin}
        isRequestPending={isRequestPending}
      />
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps<PostEditProps> = async ({
  query,
  req,
  res,
}) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  const domains = await PostAPI.getDomains();
  const id = parseInt(query.id as string);
  const post = JSON.parse(await SSR.Posts.getById(id));

  const image: PostImage = {
    source: post.image as string,
    hasChanged: false,
  };

  // Transform array of images into map values.
  const contentImages: PostContentImageMapping = {};
  const medium = post.contentImages as string[];
  if (medium) {
    medium.forEach((value: string, i: number) => {
      contentImages[`image${i}`] = {
        source: value,
        hasChanged: false,
      };
    });
  }
  const postWithImages = { ...post, image, contentImages };

  return {
    props: {
      pathDefinition: {
        title: 'Edit Post',
      },
      pageProps: {
        post: postWithImages,
        domains,
      },
    },
  };
};

export default PostEdit;

interface PostEditProps {
  pathDefinition: PathDefinition;
  pageProps: {
    post: PostDAO;
    domains: (PostDAO & SelectItem)[];
  };
}
