import { HistoryEduRounded } from '@mui/icons-material';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';

import Paragraph from 'components/Typography/Paragraph';
import Time from 'components/Typography/Time';

export default function HomeLatest({
  content = '',
  date,
  moreHref,
  moreText,
  overline,
  pretitle,
  title,
}: HomeLatestProps) {
  const t = useTheme();

  return (
    <Stack spacing={{ xs: 3, md: 0 }}>
      <Box>
        <HistoryEduRounded
          sx={{
            color: { xs: 'primary.light', md: 'primary.main' },
            float: { xs: 'right', md: 'left' },
            fontSize: { xs: t.spacing(9), md: t.spacing(10) },
            marginTop: { xs: 0, md: -3 },
            mr: 2,
          }}
        />
        <Typography variant={'overline'}>{overline}</Typography>
        <React.Fragment>
          <Typography variant={'h3'}>
            <Typography
              variant={'h3'}
              component={'span'}
              color={'primary'}
              display={'inline'}
              mr={2}>
              {pretitle}
            </Typography>
            {title}
          </Typography>
          <Time
            variant={'subtitle1'}
            date={date!}
            fontSize={{ xs: 14, md: 16 }}
          />
        </React.Fragment>
      </Box>
      <Paragraph variant={'text'} moreHref={moreHref} moreText={moreText}>
        {content}
      </Paragraph>
    </Stack>
  );
}

interface HomeLatestProps {
  content: string;
  date: Date | null;
  moreHref: string;
  moreText: string;
  overline: string;
  pretitle: string;
  title: string;
}
