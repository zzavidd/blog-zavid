import { BookOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';

import { Paragraph } from 'components/Text';
import { NextImage } from 'componentsv2/Image';
import ZDate from 'lib/date';
import { trpc } from 'utils/trpc';

export default function HomeReverie() {
  const { data: reverie } = trpc.getLatestReverie.useQuery();

  if (!reverie) return null;

  return (
    <Stack>
      <Stack direction={'row'} alignItems={'center'} spacing={2}>
        <BookOutlined sx={{ fontSize: (t) => t.spacing(9) }} />
        <Stack>
          <Typography variant={'overline'}>Latest Reverie:</Typography>
          <Typography variant={'h3'}>{reverie.title}</Typography>
          <Typography
            variant={'subtitle1'}
            component={'time'}
            dateTime={ZDate.formatISO(reverie.datePublished!)}>
            {ZDate.format(reverie.datePublished!)}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction={'row'}>
        <Stack>
          <Paragraph
            truncate={50}
            more={{
              text: 'Read my latest reverie',
              href: `/reveries/${reverie.slug}`,
            }}>
            {reverie.content}
          </Paragraph>
        </Stack>
        {reverie.image ? (
          <NextImage src={reverie.image} alt={reverie.title} />
        ) : null}
      </Stack>
    </Stack>
  );
}
