import { Container, Stack } from '@mui/material';
import type { GetStaticProps } from 'next';

import { LinkButton } from 'componentsv2/Link';
import Settings from 'constants/settings';
import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';

const NAV_BUTTONS = [{ title: 'Diary', href: '/admin/diary' }];

const AdminConsole: NextPageWithLayout = () => {
  return (
    <AdminGateway>
      <Container maxWidth={'sm'}>
        <Stack p={5}>
          {NAV_BUTTONS.map(({ title, href }, key) => {
            return (
              <LinkButton href={href} key={key}>
                {title}
              </LinkButton>
            );
          })}
        </Stack>
      </Container>
    </AdminGateway>
  );
};

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      pathDefinition: {
        title: `Admin Console | ${Settings.SITE_TITLE}`,
      },
    },
  };
};

AdminConsole.getLayout = Layout.addPartials;
export default AdminConsole;
