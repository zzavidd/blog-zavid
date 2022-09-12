import { faPenNib, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import type WishlistDAO from 'classes/wishlist/WishlistDAO';
import Alert from 'constants/alert';
import HandlersV2 from 'constants/handlersv2';
import { SITE_TITLE } from 'constants/settings';
import type { PathDefinition } from 'constants/types';
import Utils from 'constants/utils';
import Validate from 'constants/validations';
import AdminLock from 'fragments/AdminLock';
import PageMetadata from 'fragments/PageMetadata';
import WishlistForm from 'fragments/wishlist/WishlistForm';
import SSR from 'private/ssr';

const initialWishlistItem: WishlistDAO.Request = {
  name: '',
  price: 0,
  comments: '',
  quantity: 1,
  image: '',
  reservees: [],
};

// eslint-disable-next-line react/function-component-definition
const WishlistPage: NextPage<WishlistPageProps> = ({
  pathDefinition,
  pageProps,
}) => {
  const { wishlist } = pageProps;

  const [state, setState] = useState<WishlistPageState>({
    wishlistItemId: null,
    wishlistItem: initialWishlistItem,
    isDeletePromptVisible: false,
    isFormDrawOpen: false,
    isRequestPending: false,
  });
  const dispatch = Utils.createDispatch(setState);

  async function submitWishlistItem() {
    try {
      dispatch({ isRequestPending: true });
      Validate.wishlistItem(state.wishlistItem);

      await Utils.request('/api/wishlist', {
        method: 'POST',
        body: JSON.stringify({ wishlistItem: state.wishlistItem }),
      });
      Alert.success("You've successfully added a new wishlist item.");
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
      Alert.success(`You've successfully edited '${state.wishlistItem.name}'.`);
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
    } catch (e: any) {
      Alert.error(e.message);
    }
  }

  function confirmDelete() {
    dispatch({ isDeletePromptVisible: true });
  }

  return (
    <React.Fragment>
      <PageMetadata {...pathDefinition} />
      <WL.Main>
        <AdminLock>
          <WL.Division>
            <WL.Form open={state.isFormDrawOpen}>
              <WishlistForm
                wishlistItem={state.wishlistItem}
                handlers={HandlersV2(setState, 'wishlistItem')}
              />
              <WL.FormFooter>
                {state.wishlistItemId === null ? (
                  <C.SubmitButton onClick={submitWishlistItem}>
                    Submit
                  </C.SubmitButton>
                ) : (
                  <C.SubmitButton
                    onClick={updateWishlistItem}
                    disabled={!state.wishlistItemId}>
                    Update
                  </C.SubmitButton>
                )}
                <C.CancelButton
                  onClick={() => dispatch({ isFormDrawOpen: false })}>
                  Close
                </C.CancelButton>
              </WL.FormFooter>
            </WL.Form>
          </WL.Division>
        </AdminLock>
        <WL.Division>
          <WL.Grid>
            {wishlist.map((wishlistItem) => {
              const { id } = wishlistItem;
              const onEditButtonClick = () =>
                dispatch({
                  isFormDrawOpen: true,
                  wishlistItemId: id,
                  wishlistItem,
                });
              return (
                <Link href={'#'} key={id}>
                  <WL.Cell>
                    <h3>{wishlistItem.name}</h3>
                    <WL.Price>£{wishlistItem.price.toFixed(2)}</WL.Price>
                    <p>Quantity Desired: {wishlistItem.quantity}</p>
                    <WL.Image
                      src={wishlistItem.image}
                      alt={wishlistItem.name}
                    />
                    <button onClick={() => {}}>Claim</button>
                    <AdminLock>
                      <C.IButton onClick={onEditButtonClick}>
                        <FontAwesomeIcon icon={faPenNib} />
                      </C.IButton>
                      <C.IButton onClick={confirmDelete}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </C.IButton>
                    </AdminLock>
                  </WL.Cell>
                </Link>
              );
            })}
          </WL.Grid>
          <AdminLock>
            <C.IButton
              onClick={() =>
                dispatch({
                  isFormDrawOpen: true,
                  wishlistItemId: null,
                  wishlistItem: initialWishlistItem,
                })
              }>
              Add Wishlist Item
            </C.IButton>
          </AdminLock>
        </WL.Division>
      </WL.Main>
    </React.Fragment>
  );
};

namespace C {
  export const IButton = styled.button`
    background: none;
    border-style: none;
  `;

  export const Button = styled.button.attrs({ type: 'button' })`
    border: 1px solid #fff;
    font-family: 'Mulish', sans-serif;
    transition-duration: 0.3s;
    user-select: none;
  `;

  export const FormButton = styled(Button)`
    border-radius: 15px;
    color: #fff;
    min-width: 125px;
    padding: 1em;
  `;

  export const SubmitButton = styled(FormButton)`
    background-color: #391144;
  `;
  export const CancelButton = styled(FormButton)`
    background-color: #8e74ab;
  `;
}

namespace WL {
  export const Main = styled.main`
    display: flex;
    height: 100%;
  `;

  export const Division = styled.aside``;

  export const Form = styled.form<{ open: boolean }>`
    max-width: 30vw;
    transition: all 0.3s ease;

    ${({ open }) =>
      open
        ? css`
            opacity: 1;
            width: 100%;
          `
        : css`
            opacity: 0;
            width: 0;
          `};
  `;

  export const FormFooter = styled.footer``;

  export const Grid = styled.div`
    display: flex;
    gap: 1em;
    padding: 1em;
  `;

  export const Cell = styled.div`
    background-color: rgba(0, 0, 108, 0.8);
    border-radius: 15px;
    cursor: pointer;
    padding: 1em;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.03);
    }
  `;

  export const Price = styled.p`
    font-weight: bold;
  `;

  export const Image = styled.img`
    border-radius: 10px;
    max-height: 175px;
    max-width: 175px;
  `;
}

export const getServerSideProps: GetServerSideProps<
  WishlistPageProps
> = async ({ query }) => {
  const wishlist = JSON.parse(await SSR.Wishlist.getAll(query));
  return {
    props: {
      pathDefinition: {
        title: `Wishlist | ${SITE_TITLE}`,
        description: 'Gifts from this list would as nectar to my soul...',
        url: '/wishlist',
      },
      pageProps: {
        wishlist,
      },
    },
  };
};

export default WishlistPage;

interface WishlistPageProps {
  pathDefinition: PathDefinition;
  pageProps: {
    wishlist: WishlistDAO.Response[];
  };
}

interface WishlistPageState {
  wishlistItem: WishlistDAO.Request;
  wishlistItemId: number | null;
  isDeletePromptVisible: boolean;
  isFormDrawOpen: boolean;
  isRequestPending: boolean;
}
