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
import React from 'react';

import { Link } from 'components/Link';
import Paragraph from 'components/Typography/Paragraph';
import Time from 'components/Typography/Time';

import CategoryDisplay from './CategoryDisplay';

const cardProps: SxProps<Theme> = {
  'height': '100%',
  'p': { xs: 2, md: 3 },
  'transition': (t) =>
    t.transitions.create('all', {
      duration: t.transitions.duration.standard,
    }),
  '&:hover': {
    backgroundColor: (t) => lighten(t.palette.background.paper, 0.05),
  },
};

const DiaryEachItem = React.memo<DiaryEachItemProps>(
  function DiaryEachItem({ entry, searchTerm }) {
    const href = `/diary/${entry.entryNumber}`;

    return (
      <Grid xs={1}>
        <Card sx={cardProps}>
          <CardContent>
            {entry.isFavourite ? <FavoriteSymbol /> : null}
            <Time
              mb={2}
              variant={'body2'}
              date={entry.date}
              fontSize={{ xs: 12, md: 14 }}
            />
            <Typography
              variant={'h3'}
              data-testid={`zb.entry.${entry.entryNumber}`}>
              <Link
                href={href}
                variant={'h3'}
                color={'primary'}
                display={'block'}>
                Diary Entry #{entry.entryNumber}:
              </Link>
              <Typography
                variant={'h3'}
                component={'span'}
                display={'inline'}
                className={'title'}>
                {entry.title}
              </Typography>
            </Typography>
            <CategoryDisplay categories={entry.categories} my={3} />
            <Divider sx={{ marginBlock: (t) => t.spacing(4) }} />
            <Paragraph
              variant={'body1'}
              moreHref={href}
              moreText={`Read Diary Entry #${entry.entryNumber}`}
              readMoreDataTestId={`zb.readmore.${entry.entryNumber}`}
              TypographyProps={{ fontSize: { xs: 16, md: 18 } }}>
              {entry.content.includes(searchTerm) || !entry.footnote
                ? entry.content
                : entry.footnote}
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

function FavoriteSymbol() {
  return (
    <Tooltip title={'This is a personal Zavid favourite.'}>
      <FavoriteRounded
        color={'error'}
        sx={{
          fontSize: (t) => t.spacing(6),
          float: 'right',
          ml: 2,
        }}
      />
    </Tooltip>
  );
}

interface DiaryEachItemProps {
  entry: DiaryWithCategories;
  searchTerm: string;
}
