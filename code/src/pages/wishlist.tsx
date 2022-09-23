import { faPen, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import type { GetStaticProps } from 'next';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';

import type WishlistDAO from 'classes/wishlist/WishlistDAO';
import { WishlistStatic } from 'classes/wishlist/WishlistStatic';
import Clickable from 'componentsv2/Clickable';
import Alert from 'constants/alert';
import HandlersV2 from 'constants/handlersv2';
import { SITE_TITLE } from 'constants/settings';
import type { NextPageWithLayout, PathDefinition } from 'constants/types';
import Utils from 'constants/utils';
import Validate from 'constants/validations';
import AdminLock from 'fragments/AdminLock';
import PageMetadata from 'fragments/PageMetadata';
import WishlistForm from 'fragments/wishlist/WishlistForm';
import CPX from 'stylesv2/Components.styles';
import WL from 'stylesv2/Wishlist.styles';

// eslint-disable-next-line react/function-component-definition
const WishlistPage: NextPageWithLayout<WishlistPageProps> = ({
  pathDefinition,
}) => {
  const [state, setState] = useState<WishlistPageState>({
    selectedWishlistItemId: null,
    wishlistItem: WishlistStatic.initial(),
    isDeletePromptVisible: false,
    isFormDrawOpen: false,
    isRequestPending: false,
  });
  const dispatch = Utils.createDispatch(setState);

  const { data: wishlist, error } = useSWR<WishlistDAO.Response[]>(
    '/api/wishlist',
    Utils.request,
    {
      revalidateOnFocus: false,
    },
  );

  /**
   * Submits the wishlist item.
   */
  async function submitWishlistItem() {
    try {
      dispatch({ isRequestPending: true });
      Validate.wishlistItem(state.wishlistItem);

      await Utils.request('/api/wishlist', {
        method: 'POST',
        body: JSON.stringify({ wishlistItem: state.wishlistItem }),
      });
      await mutate('/api/wishlist');
      Alert.success("You've successfully added a new wishlist item.");
      dispatch({ isFormDrawOpen: false });
    } catch (e: any) {
      Alert.error(e.message);
    } finally {
      dispatch({ isRequestPending: false });
    }
  }

  /**
   * Updates the selected wishlist item.
   */
  async function updateWishlistItem() {
    try {
      dispatch({ isRequestPending: true });
      Validate.wishlistItem(state.wishlistItem);

      await Utils.request('/api/wishlist', {
        method: 'PUT',
        body: JSON.stringify({
          id: state.wishlistItem.id,
          wishlistItem: state.wishlistItem,
        }),
      });
      await mutate('/api/wishlist');
      Alert.success(`You've successfully edited '${state.wishlistItem.name}'.`);
      dispatch({ isFormDrawOpen: false });
    } catch (e: any) {
      Alert.error(e.message);
    } finally {
      dispatch({ isRequestPending: false });
    }
  }

  /**
   * Deletes the selected wishlist item.
   * @param id The wishlist ID of the item to delete.
   */
  async function deleteWishlistItem(id: number) {
    try {
      await Utils.request('/api/wishlist', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      await mutate('/api/wishlist');
      Alert.success(
        `You've successfully deleted '${state.wishlistItem.name}'.`,
      );
    } catch (e: any) {
      Alert.error(e.message);
    }
  }

  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <WL.Container>
        <AdminLock>
          <WL.Tray open={state.isFormDrawOpen}>
            <WishlistForm
              wishlistItem={state.wishlistItem}
              handlers={HandlersV2(setState, 'wishlistItem')}
            />
            <WL.FormFooter>
              {state.selectedWishlistItemId === null ? (
                <WL.FormSubmitButton onClick={submitWishlistItem}>
                  Submit
                </WL.FormSubmitButton>
              ) : (
                <WL.FormSubmitButton
                  onClick={updateWishlistItem}
                  disabled={!state.selectedWishlistItemId}>
                  Update
                </WL.FormSubmitButton>
              )}
              <WL.FormCancelButton
                onClick={() => dispatch({ isFormDrawOpen: false })}>
                Close
              </WL.FormCancelButton>
            </WL.FormFooter>
          </WL.Tray>
        </AdminLock>
        <WL.Main>
          <WL.ItemGrid>
            {wishlist &&
              !error &&
              wishlist.map((wishlistItem) => {
                const { id } = wishlistItem;
                const onEditButtonClick = () =>
                  dispatch({
                    isFormDrawOpen: true,
                    selectedWishlistItemId: id,
                    wishlistItem,
                  });
                const onDeleteButtonClick = async () => {
                  dispatch({
                    // isDeletePromptVisible: true,
                    selectedWishlistItemId: id,
                  });
                  await deleteWishlistItem(id);
                };
                const visitLink = () => {
                  window.open(
                    wishlistItem.href,
                    '_blank',
                    'noopener,noreferrer',
                  );
                };
                return (
                  <WL.ItemCell image={wishlistItem.image} key={id}>
                    <AdminLock>
                      <WL.CrudControls>
                        <Clickable.Icon
                          icon={faPen}
                          onClick={onEditButtonClick}
                        />
                        <Clickable.Icon
                          icon={faTrashAlt}
                          onClick={onDeleteButtonClick}
                        />
                      </WL.CrudControls>
                    </AdminLock>
                    <CPX.Clickable onClick={visitLink}>
                      <WL.ItemCellImageContainer>
                        <WL.ItemCellImage
                          src={wishlistItem.image}
                          alt={wishlistItem.name}
                        />
                      </WL.ItemCellImageContainer>
                    </CPX.Clickable>
                    <WL.ItemCellContent>
                      <WL.ItemName>{wishlistItem.name}</WL.ItemName>
                      <WL.ItemPrice>
                        £{wishlistItem.price.toFixed(2)}
                      </WL.ItemPrice>
                      <WL.ItemQuantity>
                        Quantity Desired: {wishlistItem.quantity}
                      </WL.ItemQuantity>
                      <WL.ItemCellFooter>
                        <WL.ItemCellFooterButton onClick={visitLink}>
                          Visit link
                        </WL.ItemCellFooterButton>
                        <WL.ItemCellFooterButton onClick={() => {}}>
                          Claim
                        </WL.ItemCellFooterButton>
                      </WL.ItemCellFooter>
                    </WL.ItemCellContent>
                  </WL.ItemCell>
                );
              })}
          </WL.ItemGrid>
          <AdminLock>
            <WL.FloatingActionButton
              onClick={() =>
                dispatch({
                  isFormDrawOpen: true,
                  selectedWishlistItemId: null,
                  wishlistItem: WishlistStatic.initial(),
                })
              }
              visible={!state.isFormDrawOpen}>
              <WL.FabIcon icon={faPlus} />
            </WL.FloatingActionButton>
          </AdminLock>
        </WL.Main>
      </WL.Container>
    </React.Fragment>
  );
};

export const getStaticProps: GetStaticProps<WishlistPageProps> = () => {
  return {
    props: {
      pathDefinition: {
        title: `Wishlist | ${SITE_TITLE}`,
        description: 'Gifts from this list would taste as nectar to my soul...',
        url: '/wishlist',
      },
    },
  };
};

export default WishlistPage;

interface WishlistPageProps {
  pathDefinition: PathDefinition;
}

export interface WishlistPageState {
  wishlistItem: WishlistDAO.Request;
  selectedWishlistItemId: number | null;
  isDeletePromptVisible: boolean;
  isFormDrawOpen: boolean;
  isRequestPending: boolean;
}
