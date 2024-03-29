import { Container, Stack, Typography } from '@mui/material';
import type { GetStaticProps } from 'next';

import Layout, { Root } from 'fragments/Layout';
import SuggestiveLinks from 'fragments/Shared/SuggestiveLinks';

const Custom404Page: NextPageWithLayout = () => {
  return (
    <Root>
      <Container maxWidth={'sm'} sx={{ alignSelf: 'center' }}>
        <Stack alignItems={'center'} spacing={3}>
          <Typography variant={'body1'} textAlign={'center'}>
            Not gonna lie, I don&#39;t know who sent you here but the page
            you&#39;re looking for doesn&#39;t exist.
          </Typography>
          <SuggestiveLinks />
        </Stack>
      </Container>
    </Root>
  );
};

Custom404Page.getLayout = Layout.addPartials;
export default Custom404Page;

export const getStaticProps: GetStaticProps<AppPageProps> = () => {
  return {
    props: {
      pathDefinition: {
        title: '404: Not Found',
      },
    },
  };
};
