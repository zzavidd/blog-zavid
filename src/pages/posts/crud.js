/* eslint-disable jsdoc/require-returns */
import { useQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { zDate } from 'zavid-modules';

import { Post } from 'classes';
import { alert, setAlert } from 'components/alert';
import hooks from 'constants/hooks';
import { OPERATIONS } from 'constants/strings';
import { isValidPost } from 'constants/validations';
import PostForm from 'lib/helpers/posts/form';
import {
  GET_POSTS_QUERY,
  CREATE_POST_QUERY,
  UPDATE_POST_QUERY
} from 'private/api/queries';

const PostCrud = ({ post: currentPost, operation }) => {
  const [statePost, setPost] = useState({
    id: 0,
    title: '',
    content: '',
    type: '',
    excerpt: '',
    image: '',
    status: Post.STATUSES.DRAFT,
    datePublished: null,
    domainId: '',
    imagesHaveChanged: false
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
    isPublish = Post.isPublish(statePost.status);
  } else {
    isPublish =
      !Post.isPublish(currentPost.status) && Post.isPublish(statePost.status);
  }

  /** Populate the form with post details. */
  const populateForm = () => {
    if (isCreateOperation) return;

    setPost(
      Object.assign({}, currentPost, {
        imagesHaveChanged: false
      })
    );
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
    if (!isValidPost(statePost)) return false;

    const variables = buildPayload(statePost, domains, isPublish, true);
    Promise.resolve()
      .then(() => createPostMutation({ variables }))
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

    const variables = buildPayload(statePost, domains, isPublish, false);
    Promise.resolve()
      .then(() => updatePostMutation({ variables }))
      .then(() => {
        setAlert({
          type: 'success',
          message: `You've successfully updated **${statePost.title}**.`
        });
        returnToAdminPosts();
      })
      .catch(alert.error);
  };

  return (
    <PostForm
      isLoaded={isLoaded}
      post={statePost}
      domains={domains}
      handlers={hooks(setPost, statePost)}
      confirmFunction={isCreateOperation ? submitPost : updatePost}
      confirmButtonText={isCreateOperation ? 'Submit' : 'Update'}
      cancelFunction={returnToAdminPosts}
      isRequestPending={isRequestPending}
    />
  );
};

/**
 * Builds the payload to send via the request.
 * @param {object} statePost The post from state.
 * @param {object[]} domains The list of domains for a page.
 * @param {boolean} isPublish Indicates if operation is publish.
 * @param {boolean} isCreateOperation Indicates if operation is create or update.
 * @returns {object} The post to submit.
 */
const buildPayload = (statePost, domains, isPublish, isCreateOperation) => {
  const {
    id,
    title,
    content,
    type,
    excerpt,
    image,
    status,
    datePublished,
    domainId,
    imagesHaveChanged
  } = statePost;

  const post = {
    title: title.trim(),
    content: content.trim(),
    type,
    excerpt: excerpt.trim(),
    image,
    status
  };

  if (Post.isPublish(status)) {
    post.datePublished = zDate.formatISODate(datePublished);
  }

  if (Post.isPage(type)) {
    const id = parseInt(domainId);
    const domainType = Post.findInPosts(domains, id, 'value').type;
    post.domainId = id;
    post.domainType = domainType;
  }

  const payload = { post, isPublish };
  if (!isCreateOperation) {
    Object.assign(payload, { id, imagesHaveChanged });
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
