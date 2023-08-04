import { Add, AttachEmail, Email as EmailIcon } from '@mui/icons-material';
import type { Post } from '@prisma/client';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

import { LinkButton } from 'components/Link';
import TableView from 'fragments/Shared/TableView';
import type {
  MoreMenuItem,
  TableViewState,
} from 'fragments/Shared/TableView.context';
import {
  TableViewContext,
  createInitialTableViewState,
} from 'fragments/Shared/TableView.context';
import { useAppSelector } from 'utils/reducers';
import { trpc } from 'utils/trpc';

import { usePostsTableFields } from './PostsAdmin.hooks';
import PostsAdminToolbar from './PostsAdminToolbar';

const initialState = createInitialTableViewState<Post>({
  sort: {
    order: 'desc',
    property: 'createTime',
  },
});

export default function PostsAdmin() {
  const [state, setState] = useState(initialState);
  const { filter } = useAppSelector((state) => state.postAdmin);
  const trpcContext = trpc.useContext();
  const { enqueueSnackbar } = useSnackbar();

  const postsTableFields = usePostsTableFields();
  const result = trpc.post.findMany.useQuery({
    params: {
      orderBy: { [state.sort.property!]: state.sort.order },
      where: filter,
      select: {
        id: true,
        title: true,
        datePublished: true,
        status: true,
        type: true,
        slug: true,
      },
    },
  });

  const { mutate: notifyPost } = trpc.post.custom.preview.useMutation();
  const { mutate: deletePost, isLoading: isDeleteOpLoading } =
    trpc.post.delete.useMutation({
      onSuccess: () => {
        void trpcContext.post.findMany.refetch();
        const { title } = state.selectedEntity!;
        const message = `You've deleted post '${title}'.`;
        enqueueSnackbar(message, { variant: 'success' });
        setState((s) => ({ ...s, isDeleteModalVisible: false }));
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });

  function onDeleteConfirm() {
    if (state.selectedEntity) {
      deletePost([state.selectedEntity?.id]);
    }
  }

  function onPreviewEtherealClick() {
    if (!state.selectedEntity) return;
    notifyPost(
      { id: state.selectedEntity.id, type: 'Ethereal' },
      {
        onSuccess: (url) => {
          window.open(url, '_blank');
        },
      },
    );
  }

  function onPreviewGmailClick() {
    if (!state.selectedEntity) return;
    notifyPost(
      { id: state.selectedEntity.id, type: 'Gmail' },
      {
        onSuccess: () => {
          enqueueSnackbar(
            `Successfully sent "${state.selectedEntity?.title}" to administrator email.`,
            { variant: 'success' },
          );
        },
      },
    );
  }

  const additionalMenuItems: MoreMenuItem[] = [
    {
      label: 'Preview Ethereal',
      Icon: EmailIcon,
      onClick: onPreviewEtherealClick,
      disabled: process.env.NEXT_PUBLIC_APP_ENV === 'production',
    },
    {
      label: 'Preview Gmail',
      Icon: AttachEmail,
      onClick: onPreviewGmailClick,
    },
  ];

  const context: ReactUseState<TableViewState<Post>> = [
    {
      ...state,
      additionalMenuItems,
      buttons: (
        <React.Fragment>
          <LinkButton href={'/admin/posts/add'} startIcon={<Add />}>
            Add post
          </LinkButton>
        </React.Fragment>
      ),
      deleteConfirmMessage: `Are you sure you want to delete the post '${state.selectedEntity?.title}'?`,
      editHref: `/admin/posts/edit/${state.selectedEntity?.id}`,
      isDeleteOpLoading,
      noEntitiesMessage: 'No posts found.',
      onDeleteConfirm,
      pageTitle: 'List of Posts',
      queryResult: result,
      tableFields: postsTableFields,
    },
    setState,
  ];

  return (
    <TableViewContext.Provider value={context}>
      <TableView />
      <PostsAdminToolbar />
    </TableViewContext.Provider>
  );
}
