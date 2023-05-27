import { Container, Typography } from '@mui/material';

import { Link } from 'componentsv2/Link';
import Layout from 'fragments/Layout';

// eslint-disable-next-line react/function-component-definition
const Custom404Page: NextPageWithLayout = () => {
  return (
    <Container maxWidth={'sm'}>
      <Typography variant={'body1'}>
        Not gonna lie, I don&#39;t know who sent you here but the page
        you&#39;re looking for doesn&#39;t exist.
      </Typography>
      <Link href={'/'}>Go home</Link>
    </Container>
  );
};

Custom404Page.getLayout = Layout.addPartials;
export default Custom404Page;
