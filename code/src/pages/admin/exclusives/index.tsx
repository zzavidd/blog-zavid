import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import ExclusivesAdmin from 'fragments/Pages/Exclusives/ExclusivesAdmin';

const ExclusivesAdminPage: NextPageWithLayout = () => {
  return (
    <AdminGateway>
      <ExclusivesAdmin />
    </AdminGateway>
  );
};

ExclusivesAdminPage.getLayout = Layout.addPartials;
export default ExclusivesAdminPage;
