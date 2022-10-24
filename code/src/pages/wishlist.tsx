import type { GetServerSideProps } from 'next';
import { useState } from 'react';

import type { NextPageWithLayout, PathDefinition } from 'constants/types';
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
import WL from 'stylesv2/Pages/Wishlist.styles';

// eslint-disable-next-line react/function-component-definition
const WishlistPage: NextPageWithLayout<WishlistPageProps> = () => {
  const [state, setState] = useState<WishlistPageState>(initialState);

  return (
    <WishlistPageContext.Provider value={[state, setState]}>
      <WL.Container>
        <WishlistGrid />
        <WishlistTray />
      </WL.Container>
      <DeleteWishlistItemModal />
      <ClaimWishlistItemModal />
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
      },
    },
  };
};

WishlistPage.getLayout = Layout.addHeaderOnly;
export default WishlistPage;

interface WishlistPageProps {
  pathDefinition: PathDefinition;
}
