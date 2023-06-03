import { HistoryEduRounded } from '@mui/icons-material';
import { Skeleton, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';

import Paragraph from 'components/Typography/Paragraph';
import Time from 'components/Typography/Time';

export default function HomeLatest({
  content = '',
  date,
  isLoading,
  moreHref,
  moreText,
  overline,
  title,
}: HomeLatestProps) {
  const t = useTheme();

  return (
    <Stack>
      <Stack direction={'row'} alignItems={'center'} spacing={2}>
        <HistoryEduRounded sx={{ fontSize: (t) => t.spacing(10) }} />
        <Stack>
          <Typography variant={'overline'}>{overline}</Typography>
          {isLoading ? (
            <React.Fragment>
              <Skeleton
                variant={'text'}
                height={t.spacing(7)}
                width={t.spacing(13)}
              />
              <Skeleton variant={'text'} width={t.spacing(11)} />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Typography variant={'h3'}>{title}</Typography>
              <Time variant={'subtitle1'} date={date!} />
            </React.Fragment>
          )}
        </Stack>
      </Stack>
      {isLoading ? (
        <Stack>
          <Skeleton variant={'text'} />
          <Skeleton variant={'text'} />
          <Skeleton variant={'text'} />
          <Skeleton variant={'text'} width={'60%'} />
        </Stack>
      ) : (
        <Paragraph truncate={50} moreHref={moreHref} moreText={moreText}>
          {content}
        </Paragraph>
      )}
    </Stack>
  );
}

interface HomeLatestProps {
  content?: string;
  date?: Date | null;
  isLoading: boolean;
  moreHref?: string;
  moreText: string;
  overline: string;
  title?: string;
}
