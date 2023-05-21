import { HistoryEduRounded } from '@mui/icons-material';
import { Skeleton, Stack, Typography, useTheme } from '@mui/material';

import { Paragraph } from 'components/Text';
import ZDate from 'lib/date';
import { trpc } from 'utils/trpc';

export default function HomeDiary() {
  const { data: entry } = trpc.getLatestDiaryEntry.useQuery();

  if (!entry) return <Placeholder />;

  return (
    <Stack>
      <Stack direction={'row'} alignItems={'center'} spacing={2}>
        <HistoryEduRounded sx={{ fontSize: (t) => t.spacing(10) }} />
        <Stack>
          <Typography variant={'overline'}>Latest Diary Entry:</Typography>
          <Typography variant={'h3'}>
            Diary Entry #{entry.entryNumber}: {entry.title}
          </Typography>
          <Typography
            variant={'subtitle1'}
            component={'time'}
            dateTime={ZDate.formatISO(entry.date)}>
            {ZDate.format(entry.date)}
          </Typography>
        </Stack>
      </Stack>
      <Paragraph
        truncate={50}
        more={{
          text: 'Read my latest diary entry',
          href: `/diary/${entry.entryNumber}`,
        }}>
        {entry.content}
      </Paragraph>
    </Stack>
  );
}

function Placeholder() {
  const theme = useTheme();
  return (
    <Skeleton
      variant={'rounded'}
      width={theme.spacing(14)}
      height={theme.spacing(7)}
    />
  );
}
