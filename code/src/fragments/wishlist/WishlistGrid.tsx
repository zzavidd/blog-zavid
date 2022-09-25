import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { signIn, useSession } from 'next-auth/react';
import { useContext } from 'react';
import useSWR, { mutate } from 'swr';

import type WishlistDAO from 'classes/wishlist/WishlistDAO';
import Clickable from 'componentsv2/Clickable';
import Alert from 'constants/alert';
import Utils from 'constants/utils';
import AdminLock from 'fragments/AdminLock';
import WL from 'stylesv2/Wishlist.styles';

import { WishlistPageContext } from './WishlistContext';

export default function WishlistGrid() {
  const [context, setContext] = useContext(WishlistPageContext);
  const consign = Utils.createDispatch(setContext);

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
        `You've successfully deleted '${context.wishlistItem.name}'.`,
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

  function onEditIconClick(wishlistItem: WishlistDAO.Request) {
    consign({
      isFormDrawOpen: true,
      selectedWishlistItemId: wishlistItem.id,
      wishlistItem,
    });
  }

  async function onDeleteIconClick(id: number) {
    consign({
      // isDeletePromptVisible: true,
      selectedWishlistItemId: id,
    });
    await deleteWishlistItem(id);
  }

  function onVisitLinkClick(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <WL.List.Main>
      <WL.List.Grid>
        {wishlist &&
          !error &&
          wishlist.map((wishlistItem) => {
            return (
              <WL.List.Cell image={wishlistItem.image} key={wishlistItem.id}>
                <AdminLock>
                  <WL.List.CrudControls>
                    <Clickable.Icon
                      icon={faPen}
                      onClick={() => onEditIconClick(wishlistItem)}
                    />
                    <Clickable.Icon
                      icon={faTrashAlt}
                      onClick={() => onDeleteIconClick(wishlistItem.id)}
                    />
                  </WL.List.CrudControls>
                </AdminLock>
                <WL.List.ItemCellImageContainer
                  onClick={() => onVisitLinkClick(wishlistItem.href)}>
                  <WL.List.ItemCellImage
                    src={wishlistItem.image}
                    alt={wishlistItem.name}
                  />
                </WL.List.ItemCellImageContainer>
                <WL.List.ItemCellContent>
                  <WL.List.ItemName>{wishlistItem.name}</WL.List.ItemName>
                  <WL.List.ItemPrice>
                    £{wishlistItem.price.toFixed(2)}
                  </WL.List.ItemPrice>
                  <WL.List.ItemQuantity>
                    Quantity Desired: {wishlistItem.quantity}
                  </WL.List.ItemQuantity>
                  <p>Claimed by {Object.keys(wishlistItem.reservees)[0]}</p>
                  <WL.List.ItemCellFooter>
                    <WL.List.ItemCellFooterButton
                      onClick={() => onVisitLinkClick(wishlistItem.href)}>
                      Visit link
                    </WL.List.ItemCellFooterButton>
                    <WL.List.ItemCellFooterButton
                      onClick={() => claimItem(wishlistItem.id)}>
                      Claim
                    </WL.List.ItemCellFooterButton>
                  </WL.List.ItemCellFooter>
                </WL.List.ItemCellContent>
              </WL.List.Cell>
            );
          })}
      </WL.List.Grid>
    </WL.List.Main>
  );
}
