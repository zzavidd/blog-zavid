import React, { useEffect, useState } from 'react';

import { ARTICLE_STATUS, OPERATIONS } from 'constants/strings';
import PostForm from 'partials/helpers/posts/form';

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

  return <PostForm post={statePost} handleText={handleText} />;
};

PostCrud.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default PostCrud;
