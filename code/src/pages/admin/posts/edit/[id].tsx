import type { GetServerSideProps, NextPage, NextPageContext } from 'next';
import React, { useEffect, useState } from 'react';
import { zDate } from 'zavid-modules';

import type {
  PostContentImageMapping,
  PostDAO,
  PostImage,
  ReactSelectChangeEvent,
  Operation,
} from 'classes';
import { PostBuilder, PostStatic, PostStatus, URLBuilder } from 'classes';
import { alert, AlertType, reportError, setAlert } from 'components/alert';
import type { PathDefinition } from 'constants/paths';
import { domain } from 'constants/settings';
import hooks from 'lib/hooks';
import PostForm from 'lib/pages/posts/form';
import { DAOParse } from 'lib/parser';
import { isValidPost } from 'lib/validations';
import { getAllPosts, getAllPostsSSR } from 'pages/api/posts';

// eslint-disable-next-line react/function-component-definition
const PostAdd: NextPage<PostAddProps> = ({ pathDefinition, pageProps }) => {
  const [clientPost, setPost] = useState<PostDAO>({
    id: 0,
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
  const [isLoaded, setLoaded] = useState(true);
  const [isRequestPending, setRequestPending] = useState(false);
  const [domains, setDomains] = useState<PostDAO[]>([]);

  // Determine if post is being published.
  const isPublish = PostStatic.isPublish(clientPost);

  /** Populate the form with post details. */
  const populateForm = (): void => {
    if (isCreateOperation) return;

    const image: PostImage = {
      source: serverPost.image as string,
      hasChanged: false,
    };

    // Transform array of images into map values.
    let contentImages: PostContentImageMapping = {};
    try {
      const medium = serverPost.contentImages as string[];
      medium.forEach((value: string, i: number) => {
        contentImages[`image${i}`] = {
          source: value,
          hasChanged: false,
        } as PostImage;
      });
    } catch {
      contentImages = {};
    }

    const postWithImages = Object.assign({}, serverPost, {
      image,
      contentImages,
    });
    setPost(postWithImages);
  };

  const onTypeChange = (e: ReactSelectChangeEvent): void => {
    const selectedType = e.target.value;
    const postsOfType = domains.filter(({ type, status }) => {
      return selectedType === type && status != PostStatus.DRAFT;
    });
    const newTypeId = postsOfType.length + 1;
    const typeId = !PostStatic.isDraft(clientPost) ? newTypeId : null;

    setPost(
      Object.assign({}, clientPost, {
        type: selectedType,
        typeId,
      }),
    );
  };

  const onStatusChange = (e: ReactSelectChangeEvent): void => {
    const selectedStatus = e.target.value;
    const postsOfType = domains.filter(({ type, status }) => {
      return clientPost.type === type && status != PostStatus.DRAFT;
    });
    const newTypeId = postsOfType.length + 1;
    const typeId = selectedStatus !== PostStatus.DRAFT ? newTypeId : null;

    setPost(
      Object.assign({}, clientPost, {
        status: selectedStatus,
        typeId,
      }),
    );
  };

  /** Create new post on server. */
  const submitPost = async (): Promise<void> => {
    if (!isValidPost(clientPost)) return;

    const variables = buildPayload(clientPost, isPublish, true);

    try {
      await createPostMutation({ variables });
      setAlert({
        type: AlertType.SUCCESS,
        message: `You've successfully added the new post titled "${clientPost.title}".`,
      });
      returnToPostAdmin();
    } catch (err) {
      reportError(err as Error);
    }
  };

  /** Update post on server. */
  const updatePost = async (): Promise<void> => {
    if (!isValidPost(clientPost)) return;

    const variables = buildPayload(clientPost, isPublish, false);

    try {
      await updatePostMutation({ variables });
      setAlert({
        type: AlertType.SUCCESS,
        message: `You've successfully updated "${clientPost.title}".`,
      });
      returnAfterUpdate(clientPost);
    } catch (err) {
      reportError(err as Error);
    }
  };

  return (
    <PostForm
      post={clientPost}
      domains={domains}
      isCreateOperation={isCreateOperation}
      handlers={{ ...hooks(setPost, clientPost), onTypeChange, onStatusChange }}
      confirmFunction={isCreateOperation ? submitPost : updatePost}
      confirmButtonText={isCreateOperation ? 'Submit' : 'Update'}
      cancelFunction={returnToPostAdmin}
      isRequestPending={isRequestPending}
    />
  );
};

const buildPayload = (
  clientPost: PostDAO,
  isPublish: boolean,
  isCreateOperation: boolean,
): PostRequest => {
  const {
    id,
    title,
    content,
    type,
    typeId,
    excerpt,
    image,
    contentImages,
    status,
    datePublished,
    domainId,
  } = clientPost;

  const post = new PostBuilder()
    .withTitle(title)
    .withType(type)
    .withTypeId(typeId)
    .withContent(content)
    .withStatus(status)
    .withImage(image)
    .withExcerpt(excerpt);

  if (contentImages?.length) {
    post.withContentImages(Object.values(contentImages));
  }

  if (PostStatic.isPublish(clientPost)) {
    post.withDatePublished(zDate.formatISODate(datePublished!));
  }

  if (PostStatic.isPage(clientPost)) {
    post.withDomain(domainId);
  }

  const payload: PostRequest = { post: post.build(), isPublish, isTest: true };
  if (!isCreateOperation) {
    payload.id = id;
  }

  return payload;
};

/** Return to the admin page. */
const returnToPostAdmin = (): void => {
  location.href = '/admin/posts';
};

const returnAfterUpdate = (post: PostDAO) => {
  const url = new URLBuilder();
  url.append(domain);

  if (PostStatic.isPage(post)) {
    const base = PostStatic.getDirectory(post.domainType!);
    url.appendSegment(base);
    url.appendSegment(post.domainSlug!);
    url.appendSegment(post.slug!);
  } else {
    const base = PostStatic.getDirectory(post.type!);
    url.appendSegment(base);
    url.appendSegment(post.slug!);
  }

  const postUrl = url.build();

  if (document.referrer === postUrl) {
    location.href = postUrl;
  } else {
    returnToPostAdmin();
  }
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
  ).map(({ id, title, type, status, datePublished }: PostDAO) => {
    return {
      value: id,
      label: `${type}: ${title}`,
      type,
      status,
      datePublished: new Date(parseInt(datePublished as string)),
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
    domains: PostDAO[];
  };
}

interface PostRequest {
  id?: number;
  post: PostDAO;
  isPublish: boolean;
  isTest: boolean;
}
