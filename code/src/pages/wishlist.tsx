import type { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Contexts from 'constants/contexts';
import type { AppState } from 'constants/reducers';
import Layout from 'fragments/Layout';
import type { WishlistPageState } from 'fragments/wishlist/WishlistContext';
import {
  initialState,
  WishlistPageContext,
} from 'fragments/wishlist/WishlistContext';
import WishlistGrid from 'fragments/wishlist/WishlistGrid';
import {
  ClaimWishlistItemModal,
  DeleteWishlistItemModal,
} from 'fragments/wishlist/WishlistModals';
import WishlistTray from 'fragments/wishlist/WishlistTray';
import WL from 'styles/Pages/Wishlist.styles';

// eslint-disable-next-line react/function-component-definition
const WishlistPage: NextPageWithLayout<WishlistPageProps> = () => {
  const [state, setState] = useState<WishlistPageState>(initialState);

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
    <WishlistPageContext.Provider value={[state, setState]}>
      <WL.Container>
        <WishlistGrid />
        <WishlistTray />
        <DeleteWishlistItemModal />
        <ClaimWishlistItemModal />
      </WL.Container>
    </WishlistPageContext.Provider>
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
