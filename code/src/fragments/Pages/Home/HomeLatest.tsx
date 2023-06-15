import { HistoryEduRounded } from '@mui/icons-material';
import { Box, Skeleton, Stack, Typography, useTheme } from '@mui/material';
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
    <Stack spacing={{ xs: 3, md: 0 }}>
      <Box>
        <HistoryEduRounded
          sx={{
            float: { xs: 'right', md: 'left' },
            fontSize: (t) => t.spacing(10),
            marginTop: { xs: 0, md: -3 },
            mr: 2,
          }}
        />

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
      </Box>
      {isLoading ? (
        <Stack>
          <Skeleton variant={'text'} />
          <Skeleton variant={'text'} />
          <Skeleton variant={'text'} />
          <Skeleton variant={'text'} width={'60%'} />
        </Stack>
      ) : (
        <Paragraph variant={'text'} moreHref={moreHref} moreText={moreText}>
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
