import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import { NextPageContext } from 'next';
import React, { useEffect, useState } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { zText } from 'zavid-modules';

import {
  EditButton,
  PostDAO,
  PostStatic,
  ReactHook,
  ReactSelectChangeEvent,
  URLBuilder
} from 'classes';
import { alert, reportError } from 'src/components/alert';
import { InvisibleButton } from 'src/components/button';
import CloudImage from 'src/components/image';
import { Spacer } from 'src/components/layout';
import { ConfirmModal } from 'src/components/modal';
import { VanillaLink } from 'src/components/text';
import { Icon, Tabler, TablerColumnHeader, TablerFieldType, TablerItemCell } from 'src/lib/library';
import BottomToolbar from 'src/lib/pages/posts/toolbar';
import { updatePostFilterSettings } from 'src/lib/reducers';
import {
  DELETE_POST_QUERY,
  GET_POSTS_QUERY
} from 'src/private/api/queries/post.queries';
import css from 'src/styles/pages/Posts.module.scss';

const PostAdmin = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState({} as PostDAO);
  const [isLoaded, setLoaded] = useState(false);
  const [deleteModalVisible, setDeleteModalVisibility] = useState(false);

  const dispatch = useDispatch();
  const options = useSelector(
    ({ postFilterOptions }: RootStateOrAny) => postFilterOptions
  );

  const handleOptionSelection = (event: ReactSelectChangeEvent) => {
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
      },
      status: {
        include: options.status ? [options.status] : []
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
    const { id, title }: PostDAO = selectedPost;
    Promise.resolve()
      .then(() => deletePostMutation({ variables: { id } }))
      .then(() => {
        alert.success(`You've deleted ${title}.`);
        setDeleteModalVisibility(false);
        refetch();
      })
      .catch(reportError);
  };

  return (
    <>
      <Spacer>
        <Tabler<9>
          heading={'List of Posts'}
          itemsLoaded={
            isLoaded && !queryLoading && networkStatus !== NetworkStatus.refetch
          }
          emptyMessage={'No posts found.'}
          columns={[
            new TablerColumnHeader('#', { centerAlign: true }),
            new TablerColumnHeader('Title'),
            new TablerColumnHeader('Type'),
            new TablerColumnHeader('Content'),
            new TablerColumnHeader('Status'),
            new TablerColumnHeader('Image', { centerAlign: true })
          ]}
          items={posts.map((post: PostDAO, key: number) => {
            return [
              new TablerItemCell(key + 1, {
                type: TablerFieldType.INDEX
              }),
              new TablerItemCell(post.title, { icon: 'heading' }),
              new TablerItemCell(post.type, {
                icon: 'newspaper',
                subvalue: (post.domainId && post.domainTitle) as string
              }),
              new TablerItemCell(
                zText.truncateText(post.content!, { limit: 30 }),
                { hideOnMobile: true }
              ),
              new TablerItemCell(post.status, { icon: 'lock' }),
              new TablerItemCell(
                (
                  <CloudImage
                    src={post.image as string}
                    containerClassName={css['post-admin-image']}
                  />
                ),
                { type: TablerFieldType.IMAGE }
              ),
              new TablerItemCell(<LinkButton post={post} key={key} />, {
                type: TablerFieldType.BUTTON
              }),
              new TablerItemCell(<EditButton id={post.id!} key={key} />, {
                type: TablerFieldType.BUTTON
              }),
              new TablerItemCell(
                (
                  <DeleteButton
                    post={post}
                    key={key}
                    setDeleteModalVisibility={setDeleteModalVisibility}
                    setSelectedPost={setSelectedPost}
                  />
                ),
                { type: TablerFieldType.BUTTON }
              )
            ];
          })}
          distribution={[
            '6%',
            '1fr',
            '10%',
            '1fr',
            '10%',
            '8%',
            '4%',
            '4%',
            '4%'
          ]}
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

const LinkButton = ({ post }: LinkButton) => {
  if (!post.slug) return null;

  const url = new URLBuilder();

  if (PostStatic.isPage(post)) {
    const base = PostStatic.getDirectory(post.domainType!);
    url.appendSegment(base);
    url.appendSegment(post.domainSlug!);
    url.appendSegment(post.slug!);
  } else {
    const base = PostStatic.getDirectory(post.type!);
    url.appendSegment(base);
    url.appendSegment(post.slug!);
  }

  const link = url.build();

  return (
    <VanillaLink href={link}>
      <Icon name={'paper-plane'} />
    </VanillaLink>
  );
};

const EditButton = ({ id }: EditButton) => {
  const navigateToLink = () => (location.href = `/admin/posts/edit/${id}`);
  return (
    <InvisibleButton onClick={navigateToLink}>
      <Icon name={'pen-alt'} />
    </InvisibleButton>
  );
};

const DeleteButton = ({
  post,
  setDeleteModalVisibility,
  setSelectedPost
}: DeleteButton) => {
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

PostAdmin.getInitialProps = async ({ query }: NextPageContext) => {
  return { ...query };
};

export default PostAdmin;

interface LinkButton {
  post: PostDAO;
}

interface DeleteButton {
  post: PostDAO;
  setDeleteModalVisibility: (event: boolean) => void;
  setSelectedPost: ReactHook<PostDAO>;
}
