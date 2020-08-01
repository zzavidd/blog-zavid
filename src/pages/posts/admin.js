import React, { useState, useEffect } from 'react';
import { zText } from 'zavid-modules';

import { InvisibleButton } from 'components/button';
import Tabler from 'components/tabler';
import request from 'constants/request.js';

const query = `
{
  getAllPosts {
    id
    title,
    content,
    image
  }
}
`;

const PostsAdmin = () => {
  const [posts, setPosts] = useState([]);
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => getPosts(), [isLoaded]);

  /** Retrieve a list of all members */
  const getPosts = () => {
    request({
      query: JSON.stringify({ query }),
      onSuccess: ({ data }) => {
        setPosts(data.getAllPosts);
        setLoaded(true);
      }
    });
  };

  return (
    <Tabler
      heading={'List of Posts'}
      itemsLoaded={isLoaded}
      emptyMessage={'No posts found.'}
      columns={[
        ['#', { centerAlign: true }],
        ['Title'],
        ['Type'],
        ['Content'],
        ['Status']
      ]}
      items={posts.map((post, key) => {
        return [
          [key + 1, { type: 'index' }],
          [post.title, { icon: 'heading' }],
          [post.type, { icon: 'heading' }],
          [
            zText.truncateText(post.content, { limit: 30 }),
            { icon: 'heading' }
          ],
          [post.status, { icon: 'heading' }]
        ];
      })}
      distribution={'4% 1fr 10% 1fr 10%'}
    />
  );
};

const EditButton = ({ id }) => {
  const link = `/admin/reviews/edit/${id}`;
  return (
    <InvisibleButton
      className={css.invisible_button}
      onClick={() => (location.href = link)}>
      <Icon name={'edit'} />
    </InvisibleButton>
  );
};

export default PostsAdmin;
