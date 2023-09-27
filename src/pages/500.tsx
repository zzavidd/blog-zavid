import { Container, Stack, Typography } from '@mui/material';

import Layout from 'fragments/Layout';

const Custom500Page: NextPageWithLayout = () => {
  return (
    <Container maxWidth={'sm'} sx={{ alignSelf: 'center' }}>
      <Stack alignItems={'center'} spacing={3}>
        <Typography variant={'body1'} textAlign={'center'}>
          Yikes. We seem to have a problem.
        </Typography>
        <Typography variant={'body1'} textAlign={'center'}>
          Try refreshing the page. If that didn&#39;t work, please bear with me
          and try again later.
        </Typography>
      </Stack>
    </Container>
  );
};

Custom500Page.getLayout = Layout.addPartials;
export default Custom500Page;
