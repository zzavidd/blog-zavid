import { Book } from '@mui/icons-material';
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
      <Stack direction={'row'} alignItems={'center'}>
        <Book />
        <Stack>
          <Typography variant={'overline'}>Latest Reverie:</Typography>
          <Typography variant={'h2'}>{reverie.title}</Typography>
          <Typography
            variant={'subtitle1'}
            component={'time'}
            dateTime={ZDate.formatISO(reverie.datePublished!)}>
            {ZDate.format(reverie.datePublished!)}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction={'row'}>
        <Paragraph
          truncate={50}
          more={{
            text: 'Read my latest reverie...',
            href: `/reveries/${reverie.slug}`,
          }}>
          {reverie.content}
        </Paragraph>
        {reverie.image ? (
          <NextImage src={reverie.image as string} alt={reverie.title} />
        ) : null}
      </Stack>
    </Stack>
  );
}
