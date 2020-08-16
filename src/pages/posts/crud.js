/* eslint-disable jsdoc/require-returns */
import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { zDate } from 'zavid-modules';

import { alert, setAlert } from 'components/alert';
import hooks from 'constants/hooks';
import { POST_STATUS, OPERATIONS } from 'constants/strings';
import { isValidPost } from 'constants/validations';
import PostForm from 'partials/helpers/posts/form';
import { CREATE_POST_QUERY, UPDATE_POST_QUERY } from 'private/api/queries';

const PostCrud = ({ post: currentPost, operation }) => {
  const [statePost, setPost] = useState({
    id: 0,
    title: '',
    content: '',
    type: '',
    excerpt: '',
    image: '',
    status: POST_STATUS.DRAFT,
    datePublished: null,
    imageHasChanged: false
  });
  const [isLoaded, setLoaded] = useState(true);
  const [isRequestPending, setRequestPending] = useState(false);

  const [createPostMutation, { loading: createLoading }] = useMutation(
    CREATE_POST_QUERY
  );
  const [updatePostMutation, { loading: updateLoading }] = useMutation(
    UPDATE_POST_QUERY
  );

  const isCreateOperation = operation === OPERATIONS.CREATE;

  // Determine if post is being published
  let isPublish = false;
  if (isCreateOperation) {
    isPublish = statePost.status === POST_STATUS.PUBLISHED;
  } else {
    isPublish =
      currentPost.status !== POST_STATUS.PUBLISHED &&
      statePost.status === POST_STATUS.PUBLISHED;
  }

  useEffect(() => {
    if (!isCreateOperation) {
      // If publishing, set date to right now.
      const datePublished =
        currentPost.status === POST_STATUS.PUBLISHED
          ? currentPost.datePublished
          : null;

      setPost(
        Object.assign({}, currentPost, {
          datePublished,
          imageHasChanged: false
        })
      );
    }
    setLoaded(true);
  }, [isLoaded]);

  useEffect(() => {
    setRequestPending(createLoading);
  }, [createLoading]);
  useEffect(() => {
    setRequestPending(updateLoading);
  }, [updateLoading]);

  /**
   * Builds the payload to send via the request.
   * @returns {object} The post to submit.
   */
  const buildPost = () => {
    const {
      id,
      title,
      content,
      type,
      excerpt,
      image,
      status,
      datePublished,
      imageHasChanged
    } = statePost;

    // Only have published date if the status is published
    const date =
      status === POST_STATUS.PUBLISHED
        ? zDate.formatISODate(datePublished)
        : null;

    const post = {
      title: title.trim(),
      content: content.trim(),
      type,
      excerpt: excerpt.trim(),
      image,
      status,
      datePublished: date
    };

    const payload = { post, isPublish };
    if (!isCreateOperation) {
      Object.assign(payload, { id, imageHasChanged });
    }

    return payload;
  };

  /** Create new post on server. */
  const submitPost = () => {
    if (!isValidPost(statePost)) return false;

    const variables = buildPost();
    createPostMutation({ variables })
      .then(() => {
        setAlert({
          type: 'success',
          message: `You've successfully added the new post titled **${statePost.title}**.`
        });
        returnToAdminPosts();
      })
      .catch(alert.error);
  };

  /** Update post on server. */
  const updatePost = () => {
    if (!isValidPost(statePost)) return false;

    const variables = buildPost();
    updatePostMutation({ variables })
      .then(() => {
        setAlert({
          type: 'success',
          message: `You've successfully updated **${statePost.title}**.`
        });
        returnToAdminPosts();
      })
      .catch(alert.error);
  };

  /** Return to the admin page. */
  const returnToAdminPosts = () => {
    location.href = '/admin/posts';
  };

  return (
    <PostForm
      post={statePost}
      handlers={hooks(setPost, statePost)}
      confirmFunction={isCreateOperation ? submitPost : updatePost}
      confirmButtonText={isCreateOperation ? 'Submit' : 'Update'}
      cancelFunction={returnToAdminPosts}
      isRequestPending={isRequestPending}
    />
  );
};

PostCrud.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default PostCrud;
