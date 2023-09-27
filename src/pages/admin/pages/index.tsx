import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import PagesAdmin from 'fragments/Pages/Pages/PagesAdmin';

const PageAdminPage: NextPageWithLayout = () => {
  return (
    <AdminGateway>
      <PagesAdmin />
    </AdminGateway>
  );
};

PageAdminPage.getLayout = Layout.addPartials;
export default PageAdminPage;
