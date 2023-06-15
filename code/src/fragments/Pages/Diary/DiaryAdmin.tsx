import {
  Add,
  AttachEmail,
  Edit,
  Email as EmailIcon,
} from '@mui/icons-material';
import type { Diary } from '@prisma/client';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

import { LinkButton } from 'components/Link';
import TableView from 'fragments/Shared/TableView';
import type {
  MoreMenuItem,
  TableViewState,
} from 'fragments/Shared/TableView.utils';
import {
  TableViewContext,
  createInitialTableViewState,
} from 'fragments/Shared/TableView.utils';
import { trpc } from 'utils/trpc';

import { useDiaryTableFields } from './DiaryAdmin.hooks';

const initialState = createInitialTableViewState<Diary>({
  sort: {
    order: 'desc',
    property: 'entryNumber',
  },
});

export default function DiaryAdmin() {
  const [state, setState] = useState(initialState);
  const trpcContext = trpc.useContext();
  const { enqueueSnackbar } = useSnackbar();

  const diaryTableFields = useDiaryTableFields(state.hoveredEntityId);
  const result = trpc.diary.findMany.useQuery({
    params: {
      orderBy: { [state.sort.property!]: state.sort.order },
      select: {
        id: true,
        title: true,
        status: true,
        date: true,
        entryNumber: true,
        isFavourite: true,
        categories: true,
      },
    },
  });

  const { mutate: notifyDiaryEntry } = trpc.diary.custom.preview.useMutation();
  const { mutate: deleteDiaryEntry, isLoading: isDeleteOpLoading } =
    trpc.diary.delete.useMutation({
      onSuccess: () => {
        void trpcContext.diary.findMany.refetch();
        const { entryNumber } = state.selectedEntity!;
        const message = `You've deleted diary entry #${entryNumber}.`;
        enqueueSnackbar(message, { variant: 'success' });
        setState((s) => ({ ...s, isDeleteModalVisible: false }));
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });

  function onDeleteConfirm() {
    if (state.selectedEntity) {
      deleteDiaryEntry([state.selectedEntity?.id]);
    }
  }

  function onPreviewEtherealClick() {
    if (!state.selectedEntity) return;
    notifyDiaryEntry(
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
    notifyDiaryEntry(
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
    },
    {
      label: 'Preview Gmail',
      Icon: AttachEmail,
      onClick: onPreviewGmailClick,
    },
  ];

  const context: ReactUseState<TableViewState<Diary>> = [
    {
      ...state,
      additionalMenuItems,
      buttons: (
        <React.Fragment>
          <LinkButton
            href={'/admin/diary/categories'}
            buttonVariant={'contained'}
            startIcon={<Edit />}>
            Edit categories
          </LinkButton>
          <LinkButton href={'/admin/diary/add'} startIcon={<Add />}>
            Add entry
          </LinkButton>
        </React.Fragment>
      ),
      deleteConfirmMessage: `Are you sure you want to delete the diary entry #${state.selectedEntity?.entryNumber}?`,
      editHref: `/admin/diary/edit/${state.selectedEntity?.id}`,
      isDeleteOpLoading,
      noEntitiesMessage: 'No diary entries found.',
      onDeleteConfirm,
      pageTitle: 'List of Diary Entries',
      queryResult: result,
      tableFields: diaryTableFields,
    },
    setState,
  ];

  return (
    <TableViewContext.Provider value={context}>
      <TableView />
    </TableViewContext.Provider>
  );
}
