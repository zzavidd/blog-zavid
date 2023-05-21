import { Box, Typography } from '@mui/material';

import { Paragraph } from 'components/Text';
import { Signature } from 'componentsv2/Image';
import Settings from 'constants/settings';
import ZDate from 'lib/date';
import { trpc } from 'utils/trpc';

export default function HomeIntroduction() {
  const { data: page } = trpc.getHomePageContent.useQuery();

  if (!page) return null;

  return (
    <Box>
      <Typography variant={'h1'}>
        {Settings.SITE_TITLE}: {Settings.SITE_TAGLINE}
      </Typography>
      <Signature
        sx={{ float: 'right', margin: (t) => t.spacing(4), width: '30%' }}
      />
      <Paragraph
        substitutions={{
          redevelopmentDate: ZDate.format(Settings.BLOG_REDEVELOPMENT_DATE),
        }}>
        {page.content}
      </Paragraph>
    </Box>
  );
}
