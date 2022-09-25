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

  useEffect(() => {
    if (status === 'authenticated') {
      Snacks.add({
        message: `Signed in as ${session?.user?.email}.`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email, status]);

  return (
    <WishlistPageContext.Provider value={[state, setState]}>
      <PageMetadata {...pathDefinition} />
      <WL.Container>
        <WishlistTray />
        <WishlistGrid />
        <AdminLock>
          <WL.FloatingActionButton
            onClick={() => {
              dispatch({
                isFormDrawOpen: true,
                selectedWishlistItemId: null,
                wishlistItem: WishlistStatic.initial(),
              });
            }}
            visible={!state.isFormDrawOpen}>
            <WL.FabIcon icon={faPlus} />
          </WL.FloatingActionButton>
        </AdminLock>
      </WL.Container>
    </WishlistPageContext.Provider>
  );
};

export default WishlistPage;

interface WishlistPageProps {
  pathDefinition: PathDefinition;
}
