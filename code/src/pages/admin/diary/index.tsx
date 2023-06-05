import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import DiaryAdmin from 'fragments/Pages/Diary/DiaryAdmin';

const DiaryAdminPage: NextPageWithLayout = () => {
  return (
    <AdminGateway>
      <DiaryAdmin />
    </AdminGateway>
  );
};

DiaryAdminPage.getLayout = Layout.addPartials;
export default DiaryAdminPage;
