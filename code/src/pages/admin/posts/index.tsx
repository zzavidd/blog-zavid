import AdminGateway from 'fragments/AdminGateway';
import Layout from 'fragments/Layout';
import PostsAdmin from 'fragments/Pages/Posts/PostsAdmin';

const PostsAdminPage: NextPageWithLayout = () => {
  return (
    <AdminGateway>
      <PostsAdmin />
    </AdminGateway>
  );
};

PostsAdminPage.getLayout = Layout.addPartials;
export default PostsAdminPage;
