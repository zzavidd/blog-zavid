/* eslint-disable jsdoc/require-returns */
import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { zDate } from 'zavid-modules';

import { alert, setAlert } from 'components/alert';
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
    datePublished: new Date()
  });
  const [isLoaded, setLoaded] = useState(true);
  const [isRequestPending, setRequestPending] = useState(false);
  const [imagesHaveChanged, setImagesChanged] = useState(false);

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

  const handleText = (event) => {
    const { name, value } = event.target;
    setPost(Object.assign({}, statePost, { [name]: value }));
  };

  useEffect(() => {
    if (!isCreateOperation) {
      // If publishing, set date to right now.
      const datePublished =
        currentPost.status !== POST_STATUS.PUBLISHED
          ? new Date()
          : currentPost.datePublished;

      setPost(Object.assign({}, currentPost, { datePublished }));
    }
    setLoaded(true);
  }, [isLoaded]);

  useEffect(() => {
    setRequestPending(createLoading);
  }, [createLoading]);

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
      datePublished
    } = statePost;

    // Only have published date if the status is published
    const date =
      status !== POST_STATUS.PUBLISHED
        ? null
        : zDate.formatISODate(datePublished);

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
      Object.assign(payload, { id, imagesHaveChanged });
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
          message: `You've successfully added the new post titled **${statePost.title}**.`
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
      handleText={handleText}
      confirmFunction={isCreateOperation ? submitPost : updatePost}
      cancelFunction={returnToAdminPosts}
      isRequestPending={isRequestPending}
    />
  );
};

PostCrud.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default PostCrud;
