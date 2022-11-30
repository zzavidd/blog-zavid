import type { GetStaticProps } from 'next';
import Link from 'next/link';

import Settings from 'constants/settings';
import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import AS from 'styles/Pages/Admin.styles';

const NAV_BUTTONS = [{ title: 'Diary', href: '/admin/diary' }];

// eslint-disable-next-line react/function-component-definition
const AdminConsole: NextPageWithLayout<AdminConsoleProps> = () => {
  return (
    <AdminGateway>
      <AS.Container>
        <AS.Main>
          {NAV_BUTTONS.map(({ title, href }, key) => {
            return (
              <Link href={href} passHref={true} key={key}>
                <AS.NavButton>
                  <a>{title}</a>
                </AS.NavButton>
              </Link>
            );
          })}
        </AS.Main>
      </AS.Container>
    </AdminGateway>
  );
};

export const getStaticProps: GetStaticProps<AdminConsoleProps> = () => {
  return {
    props: {
      pathDefinition: {
        title: `Admin Console | ${Settings.SITE_TITLE}`,
      },
    },
  };
};

AdminConsole.getLayout = Layout.addHeaderOnly;
export default AdminConsole;

interface AdminConsoleProps {
  pathDefinition: PathDefinition;
}
