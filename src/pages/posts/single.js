import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CloudinaryImage } from 'components/image';

const Post = ({post}) => {
  return <CloudinaryImage src={post.image} />;
};

Post.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default Post;