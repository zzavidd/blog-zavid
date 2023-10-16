import { PostType } from '@prisma/client';
import type { GetServerSideProps } from 'next';

import Layout from 'fragments/Layout';
import PostSingle from 'fragments/Pages/Posts/PostSingle';
import { getServerSidePostProps } from 'utils/functions/gssp';

const MusingPage: NextPageWithLayout<PostSingleProps> = (props) => {
  return <PostSingle {...props} />;
};

export const getServerSideProps: GetServerSideProps<PostSingleProps> = (
  ctx,
) => {
  return getServerSidePostProps(ctx, PostType.MUSING);
};

MusingPage.getLayout = Layout.addPartials;
export default MusingPage;
