import { Box, Skeleton, Stack, Typography } from '@mui/material';

import { Signature } from 'components/Image';
import Paragraph from 'components/Typography/Paragraph';
import ZDate from 'utils/lib/date';
import Settings from 'utils/settings';
import { trpc } from 'utils/trpc';

export default function HomeIntroduction() {
  return (
    <Box>
      <Typography variant={'h1'}>
        {Settings.SITE_TITLE}: {Settings.SITE_TAGLINE}
      </Typography>
      <Signature
        sx={{ float: 'right', margin: (t) => t.spacing(4), width: '30%' }}
      />
      <Content />
    </Box>
  );
}

function Content() {
  const { data: page } = trpc.page.find.useQuery({
    where: { slug: 'home' },
  });

  if (page) {
    return (
      <Paragraph
        mt={4}
        substitutions={{
          redevelopmentDate: ZDate.format(Settings.BLOG_REDEVELOPMENT_DATE),
        }}>
        {page.content}
      </Paragraph>
    );
  }

  return (
    <Stack spacing={5}>
      <Stack>
        <Skeleton variant={'text'} />
        <Skeleton variant={'text'} />
        <Skeleton variant={'text'} />
        <Skeleton variant={'text'} />
        <Skeleton variant={'text'} width={'60%'} />
      </Stack>
      <Stack>
        <Skeleton variant={'text'} />
        <Skeleton variant={'text'} />
        <Skeleton variant={'text'} width={'60%'} />
      </Stack>
    </Stack>
  );
}
