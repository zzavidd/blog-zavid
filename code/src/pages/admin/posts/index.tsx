import type { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { zText } from 'zavid-modules';

import { URLBuilder } from 'classes/_/URLBuilder';
import type { PostDAO, PostType, PostStatus } from 'classes/posts/PostDAO';
import { PostStatic } from 'classes/posts/PostStatic';
import { Alert, reportError } from 'components/alert';
import { InvisibleButton } from 'components/button';
import CloudImage from 'components/image';
import { Spacer } from 'components/layout';
import {
  Icon,
  Tabler,
  TablerColumnHeader,
  TablerFieldType,
  TablerItemCell,
} from 'components/library';
import { ConfirmModal } from 'components/modal';
import { VanillaLink } from 'components/text';
import { DOMAIN } from 'constants/settings';
import type {
  EditButtonProps,
  PathDefinition,
  ReactHook,
} from 'constants/types';
import * as Utils from 'constants/utils';
import PageMetadata from 'fragments/PageMetadata';
import BottomToolbar from 'fragments/shared/BottomToolbar';
import { nextAuthOptions } from 'pages/api/auth/[...nextauth]';
import SSR from 'private/ssr';
import css from 'styles/pages/Posts.module.scss';

// eslint-disable-next-line react/function-component-definition
const PostsAdmin: NextPage<PostsAdminProps> = ({
  pathDefinition,
  pageProps,
}) => {
  const { posts, filterOptions } = pageProps;
  const router = useRouter();

  const [selectedPost, setSelectedPost] = useState<PostDAO>({});
  const [deleteModalVisible, setDeleteModalVisibility] = useState(false);

  /**
   * Deletes a post.
   */
  async function deletePost() {
    const { id, title }: PostDAO = selectedPost;

    try {
      await Utils.request('/api/posts', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      Alert.success(`You've deleted ${title}.`);
      router.reload();
      setDeleteModalVisibility(false);
    } catch (e: any) {
      reportError(e.message);
    }
  }

  function onFilterOptionChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = event.target;
    const url = new URL(router.asPath, DOMAIN);
    if (value) {
      url.searchParams.set(name, value);
    } else {
      url.searchParams.delete(name);
    }
    void router.push(url.href);
  }

  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <Spacer>
        <Tabler<9>
          heading={'List of Posts'}
          itemsLoaded={true}
          emptyMessage={'No posts found.'}
          columns={[
            new TablerColumnHeader('#', { centerAlign: true }),
            new TablerColumnHeader('Title'),
            new TablerColumnHeader('Type'),
            new TablerColumnHeader('Content'),
            new TablerColumnHeader('Status'),
            new TablerColumnHeader('Image', { centerAlign: true }),
          ]}
          items={posts.map((post: PostDAO, key: number) => {
            return [
              new TablerItemCell(key + 1, {
                type: TablerFieldType.INDEX,
              }),
              new TablerItemCell(post.title, { icon: 'heading' }),
              new TablerItemCell(post.type, {
                icon: 'newspaper',
                subvalue: (post.domainId && post.domainTitle) as string,
              }),
              new TablerItemCell(
                zText.truncateText(post.content!, { limit: 30 }),
                { hideOnMobile: true },
              ),
              new TablerItemCell(post.status, { icon: 'lock' }),
              new TablerItemCell(
                (
                  <CloudImage
                    src={post.image as string}
                    containerClassName={css['post-admin-image']}
                    alt={post.title}
                  />
                ),
                { type: TablerFieldType.IMAGE },
              ),
              new TablerItemCell(<LinkButton post={post} key={key} />, {
                type: TablerFieldType.BUTTON,
              }),
              new TablerItemCell(<EditButton id={post.id!} key={key} />, {
                type: TablerFieldType.BUTTON,
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
                { type: TablerFieldType.BUTTON },
              ),
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
            '4%',
          ]}
        />
        <BottomToolbar
          options={filterOptions}
          handleOptionSelection={onFilterOptionChange}
        />
      </Spacer>
      <ConfirmModal
        visible={deleteModalVisible}
        message={`Are you sure you want to delete the ${selectedPost.type} "**${selectedPost.title}**?"`}
        confirmFunction={deletePost}
        confirmText={'Delete'}
        closeFunction={() => setDeleteModalVisibility(false)}
      />
    </React.Fragment>
  );
};

function LinkButton({ post }: LinkButton) {
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
}

function EditButton({ id }: EditButtonProps) {
  const navigateToLink = () => (location.href = `/admin/posts/edit/${id}`);
  return (
    <InvisibleButton onClick={navigateToLink}>
      <Icon name={'pen-alt'} />
    </InvisibleButton>
  );
}

function DeleteButton({
  post,
  setDeleteModalVisibility,
  setSelectedPost,
}: DeleteButton) {
  const attemptDelete = () => {
    setDeleteModalVisibility(true);
    setSelectedPost(
      Object.assign({}, post, {
        type: post.type ? post.type.toLowerCase() : 'post',
      }),
    );
  };

  return (
    <InvisibleButton onClick={attemptDelete}>
      <Icon name={'trash'} />
    </InvisibleButton>
  );
}

export const getServerSideProps: GetServerSideProps<PostsAdminProps> = async ({
  query,
  req,
  res,
}) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  const filterOptions = query as Record<string, string>;
  const {
    limit,
    field = 'createTime',
    order = 'DESC',
    type,
    status,
  } = filterOptions;
  const posts: PostDAO[] = JSON.parse(
    await SSR.Posts.getAll({
      limit: parseInt(limit),
      sort: {
        field: field as keyof PostDAO,
        order,
      },
      type: {
        include: type ? [type as PostType] : [],
      },
      status: {
        include: status ? [status as PostStatus] : [],
      },
    }),
  );

  return {
    props: {
      pathDefinition: {
        title: 'List of Posts',
      },
      pageProps: {
        posts,
        filterOptions,
      },
    },
  };
};

export default PostsAdmin;

interface PostsAdminProps {
  pathDefinition: PathDefinition;
  pageProps: {
    posts: PostDAO[];
    filterOptions: Record<string, string>;
  };
}

interface LinkButton {
  post: PostDAO;
}

interface DeleteButton {
  post: PostDAO;
  setDeleteModalVisibility: (event: boolean) => void;
  setSelectedPost: ReactHook<PostDAO>;
}
