import { useMutation, useQuery } from '@apollo/client';
import { NextPageContext } from 'next';
import React, { useEffect, useState } from 'react';
import { zDate } from 'zavid-modules';

import {
  Operation,
  PostBuilder,
  PostContentImageMapping,
  PostDAO,
  PostImage,
  PostStatic,
  PostStatus,
  ReactSelectChangeEvent,
  URLBuilder
} from 'classes';
import { alert, AlertType, reportError, setAlert } from 'src/components/alert';
import hooks from 'src/lib/hooks';
import PostForm from 'src/lib/pages/posts/form';
import { DAOParse } from 'src/lib/parser';
import { isValidPost } from 'src/lib/validations';
import {
  CREATE_POST_QUERY,
  GET_POSTS_QUERY,
  UPDATE_POST_QUERY
} from 'src/private/api/queries/post.queries';
import { domain } from 'src/settings';

interface PostInitialProps {
  post: PostDAO;
  operation: Operation;
}

interface PostRequest {
  id?: number;
  post: PostDAO;
  isPublish: boolean;
  isTest: boolean;
}

const PostCrud = ({ post: serverPost, operation }: PostInitialProps) => {
  const [clientPost, setPost] = useState({
    id: 0,
    title: '',
    content: '',
    type: undefined,
    typeId: undefined,
    excerpt: '',
    image: {
      source: '',
      hasChanged: false
    },
    contentImages: {},
    status: PostStatus.DRAFT,
    datePublished: undefined,
    domainId: undefined
  } as PostDAO);
  const [isLoaded, setLoaded] = useState(true);
  const [isRequestPending, setRequestPending] = useState(false);
  const [domains, setDomains] = useState<PostDAO[]>([]);

  // Initialise query variables.
  const { data, error: queryError, loading: queryLoading } = useQuery(
    GET_POSTS_QUERY,
    {
      variables: {
        sort: {
          field: 'type',
          order: 'DESC'
        }
      }
    }
  );

  // Initialise mutation functions.
  const [createPostMutation, { loading: createLoading }] = useMutation(
    CREATE_POST_QUERY
  );
  const [updatePostMutation, { loading: updateLoading }] = useMutation(
    UPDATE_POST_QUERY
  );

  // Determine operation type.
  const isCreateOperation = operation === Operation.CREATE;

  // Determine if post is being published.
  let isPublish = false;
  if (isCreateOperation) {
    isPublish = PostStatic.isPublish(clientPost);
  } else {
    isPublish =
      !PostStatic.isPublish(serverPost) && PostStatic.isPublish(clientPost);
  }

  /** Populate the form with post details. */
  const populateForm = (): void => {
    if (isCreateOperation) return;

    const image: PostImage = {
      source: serverPost.image as string,
      hasChanged: false
    };

    // Transform array of images into map values.
    let contentImages: PostContentImageMapping = {};
    try {
      const medium = serverPost.contentImages as string[];
      medium.forEach((value: string, i: number) => {
        contentImages[`image${i}`] = {
          source: value,
          hasChanged: false
        } as PostImage;
      });
    } catch {
      contentImages = {};
    }

    const postWithImages = Object.assign({}, serverPost, {
      image,
      contentImages
    });
    setPost(postWithImages);
  };

  /** Populate the form with post details. */
  const loadDomains = (): void => {
    if (queryLoading) return;
    if (queryError) alert.error(queryError);

    const domainList = data.getAllPosts.map(
      ({ id, type, title, datePublished }: PostDAO) => {
        return {
          value: id,
          label: `${type}: ${title}`,
          type,
          datePublished: new Date(parseInt(datePublished as string))
        };
      }
    );

    setDomains(domainList);
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
        typeId
      })
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
        typeId
      })
    );
  };

  useEffect(() => {
    populateForm();
    setLoaded(true);
  }, [isLoaded]);

  useEffect(() => {
    loadDomains();
  }, [queryLoading]);

  useEffect(() => {
    setRequestPending(createLoading || updateLoading);
  }, [createLoading, updateLoading]);

  /** Create new post on server. */
  const submitPost = async (): Promise<void> => {
    if (!isValidPost(clientPost)) return;

    const variables = buildPayload(clientPost, isPublish, true);

    try {
      await createPostMutation({ variables });
      setAlert({
        type: AlertType.SUCCESS,
        message: `You've successfully added the new post titled "${clientPost.title}".`
      });
      returnToPostAdmin();
    } catch (err) {
      reportError(err);
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
        message: `You've successfully updated "${clientPost.title}".`
      });
      returnAfterUpdate(clientPost);
    } catch (err) {
      reportError(err);
    }
  };

  return (
    <PostForm
      isLoaded={isLoaded}
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
  isCreateOperation: boolean
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
    domainId
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

PostCrud.getInitialProps = async ({ query }: NextPageContext) => {
  const post = DAOParse<PostDAO>(query.post);
  const operation = query.operation as Operation;
  return { post, operation };
};

export default PostCrud;
