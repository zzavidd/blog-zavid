import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import { useContext, useEffect, useState } from 'react';

import { WishlistStatic } from 'classes/wishlist/WishlistStatic';
import Contexts from 'constants/contexts';
import type { NextPageWithLayout, PathDefinition } from 'constants/types';
import Utils from 'constants/utils';
import AdminLock from 'fragments/AdminLock';
import PageMetadata from 'fragments/PageMetadata';
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
import WL from 'stylesv2/Wishlist.styles';

// eslint-disable-next-line react/function-component-definition
const WishlistPage: NextPageWithLayout<WishlistPageProps> = ({
  pathDefinition,
}) => {
  const [state, setState] = useState<WishlistPageState>(initialState);
  const dispatch = Utils.createDispatch(setState);

  const Snacks = useContext(Contexts.Snacks);

  const { data: session, status } = useSession();
  const email = session?.user?.email;

  useEffect(() => {
    if (status === 'authenticated') {
      Snacks.add({
        message: `Signed in as ${email}.`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, status]);

  /**
   * Opens the form tray when the action button is clicked.
   */
  function onAddButtonClick() {
    dispatch({
      isFormTrayOpen: true,
      selectedWishlistItem: null,
      wishlistItem: WishlistStatic.initial(),
    });
  }

  return (
    <WishlistPageContext.Provider value={[state, setState]}>
      <PageMetadata {...pathDefinition} />
      <WL.Container>
        <WishlistTray />
        <WishlistGrid />
        <AdminLock>
          <WL.FloatingActionButton
            onClick={onAddButtonClick}
            visible={!state.isFormTrayOpen}>
            <WL.FabIcon icon={faPlus} />
          </WL.FloatingActionButton>
        </AdminLock>
      </WL.Container>
      <DeleteWishlistItemModal />
      <ClaimWishlistItemModal />
    </WishlistPageContext.Provider>
  );
};

export default WishlistPage;

interface WishlistPageProps {
  pathDefinition: PathDefinition;
}
