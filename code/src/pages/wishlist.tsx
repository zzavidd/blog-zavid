import { faPenNib, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { GetStaticProps, NextPage } from 'next';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';

import type WishlistDAO from 'classes/wishlist/WishlistDAO';
import { WishlistStatic } from 'classes/wishlist/WishlistStatic';
import Alert from 'constants/alert';
import HandlersV2 from 'constants/handlersv2';
import { SITE_TITLE } from 'constants/settings';
import type { PathDefinition } from 'constants/types';
import Utils from 'constants/utils';
import Validate from 'constants/validations';
import AdminLock from 'fragments/AdminLock';
import PageMetadata from 'fragments/PageMetadata';
import WishlistForm from 'fragments/wishlist/WishlistForm';
import CPX from 'stylesv2/Components.styles';
import WL from 'stylesv2/Wishlist.styles';

// eslint-disable-next-line react/function-component-definition
const WishlistPage: NextPage<WishlistPageProps> = ({ pathDefinition }) => {
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
            <WL.Form>
              <WishlistForm
                wishlistItem={state.wishlistItem}
                handlers={HandlersV2(setState, 'wishlistItem')}
              />
            </WL.Form>
            <WL.FormFooter>
              {state.selectedWishlistItemId === null ? (
                <CPX.SubmitButton onClick={submitWishlistItem}>
                  Submit
                </CPX.SubmitButton>
              ) : (
                <CPX.SubmitButton
                  onClick={updateWishlistItem}
                  disabled={!state.selectedWishlistItemId}>
                  Update
                </CPX.SubmitButton>
              )}
              <CPX.CancelButton
                onClick={() => dispatch({ isFormDrawOpen: false })}>
                Close
              </CPX.CancelButton>
            </WL.FormFooter>
          </WL.Tray>
        </AdminLock>
        <WL.Main>
          <WL.Grid>
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
                return (
                  <WL.Cell key={id}>
                    <WL.ItemName>{wishlistItem.name}</WL.ItemName>
                    <WL.Image
                      src={wishlistItem.image}
                      alt={wishlistItem.name}
                    />
                    <WL.Price>£{wishlistItem.price.toFixed(2)}</WL.Price>
                    <p>Quantity Desired: {wishlistItem.quantity}</p>
                    <CPX.Hyperlink href={wishlistItem.href}>
                      Visit link
                    </CPX.Hyperlink>
                    <button onClick={() => {}}>Claim</button>
                    <AdminLock>
                      <CPX.Clickable onClick={onEditButtonClick}>
                        <FontAwesomeIcon icon={faPenNib} />
                      </CPX.Clickable>
                      <CPX.Clickable onClick={onDeleteButtonClick}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </CPX.Clickable>
                    </AdminLock>
                  </WL.Cell>
                );
              })}
          </WL.Grid>
          <AdminLock>
            <CPX.SubmitButton
              onClick={() =>
                dispatch({
                  isFormDrawOpen: true,
                  selectedWishlistItemId: null,
                  wishlistItem: WishlistStatic.initial(),
                })
              }>
              Add Wishlist Item
            </CPX.SubmitButton>
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
        description: 'Gifts from this list would as nectar to my soul...',
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
