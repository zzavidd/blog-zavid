import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import React, { useContext, useEffect, useState } from 'react';
import { mutate } from 'swr';

import { WishlistStatic } from 'classes/wishlist/WishlistStatic';
import { Modal } from 'componentsv2/Modal';
import Alert from 'constants/alert';
import Contexts from 'constants/contexts';
import { ButtonVariant } from 'constants/styling';
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
import CPX from 'stylesv2/Components.styles';
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

  /**
   * Deletes the selected wishlist item.
   */
  async function deleteWishlistItem() {
    try {
      if (!state.selectedWishlistItem) {
        throw new Error('No wishlist item selected.');
      }

      await Utils.request('/api/wishlist', {
        method: 'DELETE',
        body: JSON.stringify({ id: state.selectedWishlistItem.id }),
      });
      dispatch({ isDeletePromptVisible: false });
      await mutate('/api/wishlist');
      Alert.success(
        `You've successfully deleted '${state.selectedWishlistItem.name}'.`,
      );
    } catch (e: any) {
      Alert.error(e.message);
    }
  }

  function onCancelDeleteClick() {
    dispatch({ isDeletePromptVisible: false });
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
      <Modal
        visible={state.isDeletePromptVisible}
        body={`Are you sure you want to delete '${state.selectedWishlistItem?.name}'?`}
        footer={
          <React.Fragment>
            <CPX.Modal.FooterButton
              variant={ButtonVariant.DELETE}
              onClick={deleteWishlistItem}>
              Delete
            </CPX.Modal.FooterButton>
            <CPX.Modal.FooterButton
              variant={ButtonVariant.CANCEL}
              onClick={onCancelDeleteClick}>
              Cancel
            </CPX.Modal.FooterButton>
          </React.Fragment>
        }
      />
    </WishlistPageContext.Provider>
  );
};

export default WishlistPage;

interface WishlistPageProps {
  pathDefinition: PathDefinition;
}
