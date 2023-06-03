import {
  Article,
  EditNote,
  Favorite,
  FavoriteBorder,
  Lock,
  VisibilityOff,
} from '@mui/icons-material';
import { IconButton, Stack, Typography } from '@mui/material';
import type { Diary } from '@prisma/client';
import { DiaryStatus } from '@prisma/client';
import { useSnackbar } from 'notistack';

import { Link } from 'components/Link';
import ZDate from 'utils/lib/date';
import { trpc } from 'utils/trpc';

const STATUS_ICONS = {
  [DiaryStatus.DRAFT]: <EditNote />,
  [DiaryStatus.PROTECTED]: <Lock />,
  [DiaryStatus.PRIVATE]: <VisibilityOff />,
  [DiaryStatus.PUBLISHED]: <Article />,
};

export function useDiaryTableFields(isHovered?: boolean): TableField<Diary>[] {
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
            sx={{ visibility: isHovered ? 'visible' : 'hidden' }}>
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
