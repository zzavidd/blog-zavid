import { FavoriteRounded } from '@mui/icons-material';
import type { SxProps, Theme } from '@mui/material';
import {
  Card,
  CardContent,
  Divider,
  Skeleton,
  Tooltip,
  Typography,
  lighten,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import type { Diary } from '@prisma/client';
import React from 'react';

import Paragraph from 'components/Typography/Paragraph';
import Time from 'components/Typography/Time';

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
  function DiaryEachItem({ entry }) {
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
                    ml: 2,
                    fontSize: (t) => t.spacing(7),
                    float: 'right',
                  }}
                />
              </Tooltip>
            ) : null}
            <Time mb={2} variant={'body2'} date={entry.date} />
            <Typography
              variant={'h3'}
              data-testid={`zb.entry.${entry.entryNumber}`}>
              <Typography
                variant={'h3'}
                component={'span'}
                color={'primary'}
                display={'inline'}>
                Diary Entry #{entry.entryNumber}:&nbsp;
              </Typography>
              {entry.title}
            </Typography>
            <Divider sx={{ marginBlock: (t) => t.spacing(4) }} />
            <Paragraph
              variant={'body1'}
              truncate={25}
              moreHref={href}
              moreText={`Read #${entry.entryNumber}: ${entry.title}`}
              readMoreDataTestId={`zb.readmore.${entry.entryNumber}`}>
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

export function DiaryEachSkeleton() {
  return (
    <Grid xs={1}>
      <Card sx={cardProps}>
        <CardContent>
          <Skeleton variant={'text'} width={'50%'} />
          <Skeleton variant={'text'} />
          <Divider sx={{ marginBlock: (t) => t.spacing(4) }} />
          {Array(7)
            .fill(null)
            .map((_, key) => (
              <Skeleton variant={'text'} key={key} />
            ))}
          <Skeleton variant={'text'} width={'60%'} />
        </CardContent>
      </Card>
    </Grid>
  );
}

interface DiaryEachItemProps {
  entry: Diary;
}