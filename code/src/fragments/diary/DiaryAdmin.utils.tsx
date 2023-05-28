import {
  Article,
  EditNote,
  Favorite,
  FavoriteBorder,
  Lock,
  VisibilityOff,
} from '@mui/icons-material';
import type { TableCellProps } from '@mui/material';
import { IconButton, Stack, Typography } from '@mui/material';
import type { Diary } from '@prisma/client';
import { DiaryStatus } from '@prisma/client';
import React from 'react';

import { Link } from 'componentsv2/Link';
import ZDate from 'lib/date';

import { useUpdateDiaryEntry } from './DiaryAdmin.hooks';

const STATUS_ICONS = {
  [DiaryStatus.DRAFT]: <EditNote />,
  [DiaryStatus.PROTECTED]: <Lock />,
  [DiaryStatus.PRIVATE]: <VisibilityOff />,
  [DiaryStatus.PUBLISHED]: <Article />,
};

export function useDiaryTableFields(): DiaryTableField[] {
  const { mutate: updateDiaryEntry } = useUpdateDiaryEntry();

  function onFavouriteClick(e: Diary) {
    updateDiaryEntry({
      data: { isFavourite: !e.isFavourite },
      where: { id: e.id },
    });
  }

  return [
    {
      title: '#',
      property: 'id',
      align: 'right',
      renderValue: (e) => (
        <Typography variant={'body1'}>{e.entryNumber}</Typography>
      ),
    },
    {
      title: 'Title',
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
      title: <FavoriteBorder fontSize={'medium'} />,
      property: 'isFavourite',
      align: 'center',
      renderValue: (e) =>
        e.isFavourite ? (
          <IconButton onClick={() => onFavouriteClick(e)}>
            <Favorite color={'primary'} fontSize={'medium'} />
          </IconButton>
        ) : (
          <IconButton onClick={() => onFavouriteClick(e)}>
            <FavoriteBorder fontSize={'medium'} />
          </IconButton>
        ),
    },
    {
      title: 'Date Published',
      property: 'date',
      align: 'left',
      renderValue: (e) => (
        <Typography variant={'body1'}>{ZDate.format(e.date)}</Typography>
      ),
    },
    {
      title: 'Status',
      property: 'status',
      align: 'center',
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

interface DiaryTableField {
  title: React.ReactNode;
  property: keyof Diary;
  align?: TableCellProps['align'];
  renderValue: (entry: Diary) => React.ReactNode;
}
