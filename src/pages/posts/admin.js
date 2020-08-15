import { useQuery, useMutation, NetworkStatus } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { zText } from 'zavid-modules';

import { alert } from 'components/alert';
import { AdminButton, InvisibleButton } from 'components/button';
import { Icon } from 'components/icon';
import { Spacer, Toolbar } from 'components/layout';
import { ConfirmModal } from 'components/modal';
import Tabler from 'components/tabler';
import { GET_POSTS_QUERY, DELETE_POST_QUERY } from 'private/api/queries';

const PostsAdmin = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState({});
  const [isLoaded, setLoaded] = useState(false);
  const [deleteModalVisible, setDeleteModalVisibility] = useState(false);

  const {
    data,
    error: queryError,
    loading: queryLoading,
    refetch,
    networkStatus
  } = useQuery(GET_POSTS_QUERY, {
    variables: {
      limit: 10,
      sort: {
        field: 'id',
        order: 'DESC'
      }
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true
  });
  const [deletePostMutation] = useMutation(DELETE_POST_QUERY);

  useEffect(() => {
    if (networkStatus === NetworkStatus.refetch) return;
    if (queryLoading) return;
    if (queryError) alert.error(queryError);
    setPosts(data.getAllPosts);
    setLoaded(true);
  }, [queryLoading, networkStatus]);

  const navigateToCreateForm = () => {
    location.href = '/admin/posts/add';
  };

  const deletePost = () => {
    const { id, title } = selectedPost;
    deletePostMutation({ variables: { id } })
      .then(() => {
        alert.success(`You've deleted ${title}.`);
        setDeleteModalVisibility(false);
        refetch();
      })
      .catch(console.error);
  };

  return (
    <>
      <Spacer>
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
              [post.status, { icon: 'heading' }],
              [<EditButton id={post.id} key={key} />, { type: 'button' }],
              [
                <DeleteButton
                  post={post}
                  key={key}
                  setDeleteModalVisibility={setDeleteModalVisibility}
                  setSelectedPost={setSelectedPost}
                />,
                { type: 'button' }
              ]
            ];
          })}
          distribution={'6% 1fr 10% 1fr 10% 4% 4%'}
        />
        <Toolbar>
          <AdminButton onClick={navigateToCreateForm}>Add New Post</AdminButton>
        </Toolbar>
      </Spacer>
      <ConfirmModal
        visible={deleteModalVisible}
        message={`Are you sure you want to delete the ${selectedPost.type} "**${selectedPost.title}**?"`}
        confirmFunction={deletePost}
        confirmText={'Delete'}
        closeFunction={() => setDeleteModalVisibility(false)}
      />
    </>
  );
};

const EditButton = ({ id }) => {
  const navigateToLink = () => (location.href = `/admin/posts/edit/${id}`);
  return (
    <InvisibleButton onClick={navigateToLink}>
      <Icon name={'pen-alt'} />
    </InvisibleButton>
  );
};

const DeleteButton = ({ post, setDeleteModalVisibility, setSelectedPost }) => {
  const attemptDelete = () => {
    setDeleteModalVisibility(true);
    setSelectedPost(
      Object.assign({}, post, {
        type: post.type ? post.type.toLowerCase() : 'post'
      })
    );
  };

  return (
    <InvisibleButton onClick={attemptDelete}>
      <Icon name={'trash'} />
    </InvisibleButton>
  );
};

export default PostsAdmin;
