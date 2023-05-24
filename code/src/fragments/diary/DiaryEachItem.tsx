import { FavoriteRounded } from '@mui/icons-material';
import type { SxProps, Theme } from '@mui/material';
import {
  Card,
  CardContent,
  Divider,
  Tooltip,
  Typography,
  lighten,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import type { Diary } from '@prisma/client';
import React from 'react';

import { Paragraph } from 'components/Text';
import ZDate from 'lib/date';

const cardProps: SxProps<Theme> = {
  'height': '100%',
  'padding': (t) => t.spacing(4),
  'transition': (t) =>
    t.transitions.create('all', {
      duration: t.transitions.duration.standard,
    }),
  '&:hover': {
    backgroundColor: (t) => lighten(t.palette.background.paper, 0.05),
  },
};

const DiaryEachItem = React.memo<DiaryEachItemProps>(
  function DiaryEntry({ entry }) {
    const href = `/diary/${entry.entryNumber}`;

    return (
      <Grid xs={1}>
        <Card sx={cardProps}>
          <CardContent>
            {entry.isFavourite ? (
              <Tooltip title={'This is a personal Zavid favourite.'}>
                <FavoriteRounded
                  color={'primary'}
                  sx={{
                    fontSize: (t) => t.spacing(7),
                    float: 'right',
                  }}
                />
              </Tooltip>
            ) : null}
            <Typography
              variant={'subtitle1'}
              component={'time'}
              dateTime={ZDate.formatISO(entry.date)}>
              {ZDate.format(entry.date)}
            </Typography>
            <Typography variant={'h3'}>
              Diary Entry #{entry.entryNumber}: {entry.title}
            </Typography>
            <Divider sx={{ marginBlock: (t) => t.spacing(4) }} />
            <Paragraph
              variant={'body1'}
              truncate={40}
              moreHref={href}
              moreText={`Read #${entry.entryNumber}: ${entry.title}`}>
              {entry.content}
            </Paragraph>
          </CardContent>
        </Card>
      </Grid>
    );
  },
  (a, b) => a.entry.id === b.entry.id,
);

export default DiaryEachItem;

interface DiaryEachItemProps {
  entry: Diary;
}
