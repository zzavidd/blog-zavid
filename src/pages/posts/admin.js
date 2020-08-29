import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { zLogic, zText } from 'zavid-modules';

import { Post, URLBuilder } from 'classes';
import { alert } from 'components/alert';
import { AdminButton, InvisibleButton } from 'components/button';
import { Field, FieldRow, Select } from 'components/form';
import { Icon } from 'components/icon';
import { Spacer, Toolbar } from 'components/layout';
import { ConfirmModal } from 'components/modal';
import Tabler, { TYPE } from 'components/tabler';
import { updatePostFilterSettings } from 'lib/reducers/actions';
import { DELETE_POST_QUERY, GET_POSTS_QUERY } from 'private/api/queries';
import css from 'styles/pages/Posts.module.scss';

const sortOptions = [
  { value: 'createTime', label: 'Sort by Creation Time' },
  { value: 'title', label: 'Sort by Title' },
  { value: 'type', label: 'Sort by Type' },
  { value: 'status', label: 'Sort by Status' }
];

const PostsAdmin = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState({});
  const [isLoaded, setLoaded] = useState(false);
  const [deleteModalVisible, setDeleteModalVisibility] = useState(false);

  const dispatch = useDispatch();
  const options = useSelector(({ postFilterOptions }) => postFilterOptions);

  const handleOptionSelection = (event) => {
    const { name, value } = event.target;
    dispatch(updatePostFilterSettings({ [name]: value }));
  };

  const {
    data,
    error: queryError,
    loading: queryLoading,
    refetch,
    networkStatus
  } = useQuery(GET_POSTS_QUERY, {
    variables: {
      limit: parseInt(options.limit),
      sort: {
        field: options.field || null,
        order: options.order
      },
      type: {
        include: options.type ? [options.type] : []
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

    const { getAllPosts: postList = [] } = data;
    setPosts(postList);
    setLoaded(true);
  }, [queryLoading, options, networkStatus]);

  const deletePost = () => {
    const { id, title } = selectedPost;
    Promise.resolve()
      .then(() => deletePostMutation({ variables: { id } }))
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
          itemsLoaded={
            isLoaded && !queryLoading && networkStatus !== NetworkStatus.refetch
          }
          emptyMessage={'No posts found.'}
          columns={[
            ['#', { centerAlign: true }],
            ['Title'],
            ['Type'],
            ['Content'],
            ['Status'],
            ['Image', { centerAlign: true }]
          ]}
          items={posts.map((post, key) => {
            return [
              [key + 1, { type: TYPE.INDEX }],
              [post.title, { icon: 'heading' }],
              [post.type, { icon: 'heading' }],
              [
                zText.truncateText(post.content, { limit: 30 }),
                { icon: 'heading' }
              ],
              [post.status, { icon: 'heading' }],
              [post.image, { type: TYPE.IMAGE }],
              [
                <LinkButton post={post} allPosts={posts} key={key} />,
                { type: TYPE.BUTTON }
              ],
              [<EditButton id={post.id} key={key} />, { type: TYPE.BUTTON }],
              [
                <DeleteButton
                  post={post}
                  key={key}
                  setDeleteModalVisibility={setDeleteModalVisibility}
                  setSelectedPost={setSelectedPost}
                />,
                { type: TYPE.BUTTON }
              ]
            ];
          })}
          distribution={'6% 1fr 10% 1fr 10% 8% 4% 4% 4%'}
        />
        <BottomToolbar
          options={options}
          handleOptionSelection={handleOptionSelection}
        />
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

const BottomToolbar = ({ options, handleOptionSelection }) => {
  const navigateToCreateForm = () => {
    location.href = '/admin/posts/add';
  };
  return (
    <Toolbar>
      <FieldRow>
        <Field xs={5}>
          <AdminButton onClick={navigateToCreateForm}>Add New Post</AdminButton>
        </Field>
        <Field xs={2}>
          <FilterDropdown
            name={'field'}
            items={sortOptions}
            value={options.field}
            onChange={handleOptionSelection}
          />
        </Field>
        <Field xs={1}>
          <FilterDropdown
            name={'order'}
            items={['ASC', 'DESC']}
            value={options.order}
            onChange={handleOptionSelection}
          />
        </Field>
        <Field xs={2}>
          <FilterDropdown
            name={'type'}
            items={Post.typeList}
            value={options.type}
            onChange={handleOptionSelection}
            placeholder={'Filter by type...'}
            isPlaceholderSelectable={true}
          />
        </Field>
        <Field xs={1}>
          <FilterDropdown
            name={'limit'}
            items={[10, 20, 50, 100]}
            value={options.limit}
            onChange={handleOptionSelection}
            placeholder={'Show All'}
            isPlaceholderSelectable={true}
          />
        </Field>
      </FieldRow>
    </Toolbar>
  );
};

const FilterDropdown = (props) => {
  return <Select {...props} className={css['post-filter']} isRound={true} />;
};

const LinkButton = ({ post, allPosts }) => {
  if (zLogic.isFalsy(post.slug)) return null;

  const navigateToLink = () => {
    const url = new URLBuilder();

    if (Post.isPage(post.type)) {
      const base = Post.getDirectory(post.domainType);
      const domain = Post.findInPosts(allPosts, post.domainId, 'id', 'slug');
      url.appendSegment(base);
      url.appendSegment(domain);
      url.appendSegment(post.slug);
    } else {
      const base = Post.getDirectory(post.type);
      url.appendSegment(base);
      url.appendSegment(post.slug);
    }

    location.href = url.build();
  };

  return (
    <InvisibleButton onClick={navigateToLink}>
      <Icon name={'paper-plane'} />
    </InvisibleButton>
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
