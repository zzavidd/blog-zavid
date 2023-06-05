import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import SubscriberAdmin from 'fragments/Pages/Subscribe/SubscriberAdmin';

const SubscriberAdminPage: NextPageWithLayout = () => {
  return (
    <AdminGateway>
      <SubscriberAdmin />
    </AdminGateway>
  );
};

SubscriberAdminPage.getLayout = Layout.addPartials;
export default SubscriberAdminPage;
