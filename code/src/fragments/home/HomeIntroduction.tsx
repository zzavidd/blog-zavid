import { Box, Skeleton, Stack, Typography } from '@mui/material';

import { Paragraph } from 'components/Text';
import { Signature } from 'componentsv2/Image';
import Settings from 'constants/settings';
import ZDate from 'lib/date';
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
  const { data: page } = trpc.getHomePageContent.useQuery();

  if (page) {
    return (
      <Paragraph
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
