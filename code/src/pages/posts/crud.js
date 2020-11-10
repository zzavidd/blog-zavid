/* eslint-disable jsdoc/require-returns */
import { useQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { zDate } from 'zavid-modules';

import { alert, setAlert, reportError } from 'components/alert';
import hooks from 'constants/hooks';
import { OPERATIONS } from 'constants/strings';
import { isValidPost } from 'constants/validations';
import { PostStatic } from 'lib/classes';
import PostForm from 'lib/helpers/pages/posts/form';
import {
  GET_POSTS_QUERY,
  CREATE_POST_QUERY,
  UPDATE_POST_QUERY
} from 'private/api/queries/post.queries';

const PostCrud = ({ post: serverPost, operation }) => {
  const [clientPost, setPost] = useState({
    id: 0,
    title: '',
    content: '',
    type: '',
    typeId: 1,
    excerpt: '',
    image: {
      source: '',
      hasChanged: false
    },
    contentImages: {},
    status: PostStatic.STATUS.DRAFT,
    datePublished: null,
    domainId: ''
  });
  const [isLoaded, setLoaded] = useState(true);
  const [isRequestPending, setRequestPending] = useState(false);
  const [domains, setDomains] = useState([]);

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
  const isCreateOperation = operation === OPERATIONS.CREATE;

  // Determine if post is being published.
  let isPublish = false;
  if (isCreateOperation) {
    isPublish = PostStatic.isPublish(clientPost.status);
  } else {
    isPublish =
      !PostStatic.isPublish(serverPost.status) && PostStatic.isPublish(clientPost.status);
  }

  /** Populate the form with post details. */
  const populateForm = () => {
    if (isCreateOperation) return;

    const image = {
      source: serverPost.image,
      hasChanged: false
    };

    // Transform array of images into map values.
    let contentImages = {};
    try {
      serverPost.contentImages.forEach((value, i) => {
        contentImages[`image${i}`] = {
          source: value,
          hasChanged: false
        };
      });
    } catch {
      contentImages = null;
    }

    setPost(
      Object.assign({}, serverPost, {
        image,
        contentImages
      })
    );

    // setDefaultTypeId();
  };

  /** Populate the form with post details. */
  const loadDomains = () => {
    if (queryLoading) return;
    if (queryError) alert.error(queryError);

    const domainList = data.getAllPosts.map(
      ({ id, type, title, datePublished }) => {
        return {
          value: id,
          label: `${type}: ${title}`,
          type,
          datePublished: new Date(parseInt(datePublished))
        };
      }
    );

    setDomains(domainList);
  };

  const setDefaultTypeId = (e) => {
    const selectedType = e.target.value;
    const postsOfType = domains.filter(({ type }) => selectedType === type);
    setPost(
      Object.assign({}, clientPost, {
        type: selectedType,
        typeId: postsOfType.length + 1
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
  const submitPost = () => {
    if (!isValidPost(clientPost)) return false;

    const variables = buildPayload(clientPost, domains, isPublish, true);
    Promise.resolve()
      .then(() => createPostMutation({ variables }))
      .then(() => {
        setAlert({
          type: 'success',
          message: `You've successfully added the new post titled "${clientPost.title}".`
        });
        returnToAdminPosts();
      })
      .catch(reportError);
  };

  /** Update post on server. */
  const updatePost = () => {
    if (!isValidPost(clientPost)) return false;

    const variables = buildPayload(clientPost, domains, isPublish, false);
    Promise.resolve()
      .then(() => updatePostMutation({ variables }))
      .then(() => {
        setAlert({
          type: 'success',
          message: `You've successfully updated "${clientPost.title}".`
        });
        returnToAdminPosts();
      })
      .catch(reportError);
  };

  return (
    <PostForm
      isLoaded={isLoaded}
      post={clientPost}
      domains={domains}
      isCreateOperation={isCreateOperation}
      handlers={{ ...hooks(setPost, clientPost), setDefaultTypeId }}
      confirmFunction={isCreateOperation ? submitPost : updatePost}
      confirmButtonText={isCreateOperation ? 'Submit' : 'Update'}
      cancelFunction={returnToAdminPosts}
      isRequestPending={isRequestPending}
    />
  );
};

/**
 * Builds the payload to send via the request.
 * @param {object} clientPost The post from state.
 * @param {object[]} domains The list of domains for a page.
 * @param {boolean} isPublish Indicates if operation is publish.
 * @param {boolean} isCreateOperation Indicates if operation is create or update.
 * @returns {object} The post to submit.
 */
const buildPayload = (clientPost, domains, isPublish, isCreateOperation) => {
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

  const post = {
    title: title.trim(),
    content: content.trim(),
    type,
    excerpt: excerpt.trim(),
    image,
    contentImages: contentImages ? Object.values(contentImages) : null,
    status
  };

  if (PostStatic.isPublish(post)) {
    post.datePublished = zDate.formatISODate(datePublished);
  }

  if (PostStatic.isPage(post)) {
    post.domainId = parseInt(domainId);
  } else {
    post.typeId = parseInt(typeId);
  }

  const payload = { post, isPublish };
  if (!isCreateOperation) {
    payload.id = id;
  }

  return payload;
};

/** Return to the admin page. */
const returnToAdminPosts = () => {
  location.href = '/admin/posts';
};

PostCrud.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default PostCrud;
