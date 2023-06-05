import {
  Article,
  EditNote,
  Email as EmailIcon,
  Favorite,
  FavoriteBorder,
  Lock,
  VisibilityOff,
} from '@mui/icons-material';
import { IconButton, Stack, Typography } from '@mui/material';
import type { Diary } from '@prisma/client';
import { DiaryStatus } from '@prisma/client';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import { Link } from 'components/Link';
import TableView from 'fragments/Shared/TableView';
import type { TableViewState } from 'fragments/Shared/TableView.utils';
import {
  TableViewContext,
  createInitialTableViewState,
} from 'fragments/Shared/TableView.utils';
import ZDate from 'utils/lib/date';
import { trpc } from 'utils/trpc';

const STATUS_ICONS = {
  [DiaryStatus.DRAFT]: <EditNote />,
  [DiaryStatus.PROTECTED]: <Lock />,
  [DiaryStatus.PRIVATE]: <VisibilityOff />,
  [DiaryStatus.PUBLISHED]: <Article />,
};

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
    orderBy: { [state.sort.property!]: state.sort.order },
    select: {
      id: true,
      title: true,
      status: true,
      date: true,
      entryNumber: true,
      isFavourite: true,
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

  function onPreviewEmailClick() {
    if (!state.selectedEntity) return;
    notifyDiaryEntry(state.selectedEntity.id, {
      onSuccess: (url) => {
        window.open(url, '_blank');
      },
    });
  }

  const context: ReactUseState<TableViewState<Diary>> = [
    {
      ...state,
      addButtonHref: '/admin/diary/add',
      addButtonText: 'Add entry',
      additionalMenuItems: [
        {
          label: 'Preview email',
          Icon: EmailIcon,
          onClick: onPreviewEmailClick,
        },
      ],
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

function useDiaryTableFields(
  hoveredEntityId: number | null,
): TableField<Diary>[] {
  const { enqueueSnackbar } = useSnackbar();
  const trpcContext = trpc.useContext();
  const { mutate: updateDiaryEntry } = trpc.diary.update.useMutation({
    onSuccess: async (entry) => {
      await trpcContext.diary.findMany.refetch();
      const verb = entry.isFavourite ? 'favourited' : 'unfavourited';
      const message = `You've ${verb} diary entry #${entry.entryNumber}.`;
      enqueueSnackbar(message, { variant: 'success' });
    },
  });

  function onFavouriteClick(e: Diary) {
    updateDiaryEntry({
      diary: {
        data: { isFavourite: !e.isFavourite },
        where: { id: e.id },
      },
      isPublish: false,
    });
  }

  return [
    {
      title: <Typography variant={'h6'}>#</Typography>,
      property: 'entryNumber',
      align: 'right',
      renderValue: (e) => (
        <Typography variant={'body1'}>{e.entryNumber}</Typography>
      ),
    },
    {
      title: <Typography variant={'h6'}>Title</Typography>,
      property: 'title',
      align: 'left',
      renderValue: (e) => (
        <Link
          href={`/diary/${e.entryNumber}`}
          variant={'body1'}
          color={'inherit'}
          fontWeight={400}
          underline={'hover'}>
          {e.title}
        </Link>
      ),
    },
    {
      title: <Favorite fontSize={'medium'} sx={{ mx: 2 }} />,
      property: 'isFavourite',
      align: 'left',
      renderValue: (e) => {
        if (e.isFavourite) {
          return (
            <IconButton onClick={() => onFavouriteClick(e)}>
              <Favorite color={'primary'} fontSize={'medium'} />
            </IconButton>
          );
        }

        return (
          <IconButton
            onClick={() => onFavouriteClick(e)}
            sx={{
              visibility: e.id === hoveredEntityId ? 'visible' : 'hidden',
            }}>
            <FavoriteBorder fontSize={'medium'} />
          </IconButton>
        );
      },
    },
    {
      title: <Typography variant={'h6'}>Date Published</Typography>,
      property: 'date',
      align: 'left',
      renderValue: (e) => (
        <Typography variant={'body1'}>{ZDate.format(e.date)}</Typography>
      ),
    },
    {
      title: <Typography variant={'h6'}>Status</Typography>,
      property: 'status',
      align: 'left',
      renderValue: (e) => {
        return (
          <Stack direction={'row'} alignItems={'center'} spacing={2}>
            {STATUS_ICONS[e.status]}
            <Typography variant={'body1'}>{e.status}</Typography>
          </Stack>
        );
      },
    },
  ];
}
