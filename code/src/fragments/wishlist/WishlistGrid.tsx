import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';

import type WishlistDAO from 'classes/wishlist/WishlistDAO';
import Clickable from 'componentsv2/Clickable';
import Alert from 'constants/alert';
import Utils from 'constants/utils';
import AdminLock from 'fragments/AdminLock';
import CPX from 'stylesv2/Components.styles';
import WL from 'stylesv2/Wishlist.styles';

import type { WishlistPageState } from './WishlistContext';
import { initialState } from './WishlistContext';

export default function WishlistGrid() {
  const [state, setState] = useState<WishlistPageState>(initialState);
  const dispatch = Utils.createDispatch(setState);

  const { data: session, status } = useSession();
  const { data: wishlist, error } = useSWR<WishlistDAO.Response[]>(
    '/api/wishlist',
    Utils.request,
    {
      revalidateOnFocus: false,
    },
  );

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

  /**
   * Claims an item by assigning a reservee to it.
   * @param id The ID of the item to claim.
   */
  async function claimItem(id: number) {
    try {
      if (status !== 'authenticated' || !session) {
        return signIn('google');
      }

      await Utils.request<WishlistDAO.Request>('/api/wishlist/claim', {
        method: 'PUT',
        body: JSON.stringify({
          id,
          reservee: session.user?.email,
        }),
      });
      await mutate('/api/wishlist');
    } catch (e: any) {
      Alert.error(e.message);
    }
  }

  return (
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
              window.open(wishlistItem.href, '_blank', 'noopener,noreferrer');
            };
            return (
              <WL.ItemCell image={wishlistItem.image} key={id}>
                <AdminLock>
                  <WL.CrudControls>
                    <Clickable.Icon icon={faPen} onClick={onEditButtonClick} />
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
                  <WL.ItemPrice>£{wishlistItem.price.toFixed(2)}</WL.ItemPrice>
                  <WL.ItemQuantity>
                    Quantity Desired: {wishlistItem.quantity}
                  </WL.ItemQuantity>
                  <p>Claimed by {Object.keys(wishlistItem.reservees)[0]}</p>
                  <WL.ItemCellFooter>
                    <WL.ItemCellFooterButton onClick={visitLink}>
                      Visit link
                    </WL.ItemCellFooterButton>
                    <WL.ItemCellFooterButton onClick={() => claimItem(id)}>
                      Claim
                    </WL.ItemCellFooterButton>
                  </WL.ItemCellFooter>
                </WL.ItemCellContent>
              </WL.ItemCell>
            );
          })}
      </WL.ItemGrid>
    </WL.Main>
  );
}
