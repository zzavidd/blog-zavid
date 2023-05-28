import { Container, Stack, Typography } from '@mui/material';

import { LinkButton } from 'componentsv2/Link';
import Layout from 'fragments/Layout';

const Custom404Page: NextPageWithLayout = () => {
  return (
    <Container maxWidth={'sm'} sx={{ alignSelf: 'center' }}>
      <Stack alignItems={'center'} spacing={3}>
        <Typography variant={'body1'} textAlign={'center'}>
          Not gonna lie, I don&#39;t know who sent you here but the page
          you&#39;re looking for doesn&#39;t exist.
        </Typography>
        <LinkButton href={'/'}>Go home</LinkButton>
      </Stack>
    </Container>
  );
};

Custom404Page.getLayout = Layout.addPartials;
export default Custom404Page;
