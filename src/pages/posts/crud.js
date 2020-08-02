import React, { useEffect, useState } from 'react';

import { alert, setAlert } from 'components/alert';
import graphQLRequest from 'constants/request';
import { ARTICLE_STATUS, OPERATIONS } from 'constants/strings';
import { isValidPost } from 'constants/validations';
import PostForm from 'partials/helpers/posts/form';

const createPostQuery = `
mutation {
  createPost(post: PostInput!)
}
`;

const updatePostQuery = `
mutation {
  updatePost($id: Int!, $post: PostInput!)
}
`;

const PostCrud = ({ post: currentPost, operation }) => {
  const [statePost, setPost] = useState({
    id: 0,
    title: '',
    content: '',
    type: '',
    excerpt: '',
    image: null,
    status: ARTICLE_STATUS.DRAFT,
    datePublished: new Date()
  });
  const [isLoaded, setLoaded] = useState(true);
  const [isRequestPending, setRequestPending] = useState(false);
  const isCreateOperation = operation === OPERATIONS.CREATE;

  const handleText = (event) => {
    const { name, value } = event.target;
    setPost(Object.assign({}, statePost, { [name]: value }));
  };

  useEffect(() => {
    if (!isCreateOperation) {
      // If publishing, set date to right now.
      const datePublished =
        currentPost.status !== ARTICLE_STATUS.PUBLISHED
          ? new Date()
          : currentPost.datePublished;

      setPost(Object.assign({}, currentPost, { datePublished }));
    }
    setLoaded(true);
  }, [isLoaded]);

  const submitPost = () => {
    if (!isValidPost(statePost)) return false;
    setRequestPending(true);
    graphQLRequest({
      query: JSON.stringify({
        query: createPostQuery,
        variables: { post: statePost }
      }),
      onSuccess: () => {
        alert.success();
        setAlert({
          type: 'success',
          message: `You've successfully added the new post titled **${statePost.title}**.`
        });
        returnToAdminPosts();
      },
      onError: () => {
        setRequestPending(false);
      }
    });
  };

  const updatePost = () => {
    if (!isValidPost(statePost)) return false;
    setRequestPending(true);
    graphQLRequest({
      query: JSON.stringify({
        query: updatePostQuery,
        variables: { id: statePost.id, post: statePost }
      }),
      onSuccess: () => {
        alert.success();
        setAlert({
          type: 'success',
          message: `You've successfully added the new post titled **${statePost.title}**.`
        });
        returnToAdminPosts();
      },
      onError: () => {
        setRequestPending(false);
      }
    });
  };

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
