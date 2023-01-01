import ZIV from '@ziventi/wishlist';
import type { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Contexts from 'constants/contexts';
import type { AppState } from 'constants/reducers';
import Layout from 'fragments/Layout';

// eslint-disable-next-line react/function-component-definition
const WishlistPage: NextPageWithLayout<WishlistPageProps> = () => {
  const appState = useSelector((state: AppState) => state);
  const { data: session, status } = useSession();
  const email = session?.user?.email;

  const Snacks = useContext(Contexts.Snacks);

  /**
   * Shows snack if user is logged in.
   */
  useEffect(() => {
    if (status !== 'authenticated' || !appState.session.loginSnackShown) return;
    Snacks.add({ message: `Signed in as ${email}.` });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, status]);

  return (
    <ZIV.WishlistProvider>
      <ZIV.WLStyles.Container>
        <ZIV.Grid />
        <ZIV.Tray />
      </ZIV.WLStyles.Container>
    </ZIV.WishlistProvider>
  );
};

export const getServerSideProps: GetServerSideProps<
  WishlistPageProps
  // eslint-disable-next-line require-await
> = async ({ res }) => {
  res.setHeader('X-Robots-Tag', 'noindex');
  return {
    props: {
      pathDefinition: {
        title: "Zavid's Wishlist",
        description: 'Consider anything on this list nectar to my soul.',
        url: '/wishlist',
      },
    },
  };
};

WishlistPage.getLayout = Layout.addHeaderOnly;
export default WishlistPage;

interface WishlistPageProps {
  pathDefinition: PathDefinition;
}
