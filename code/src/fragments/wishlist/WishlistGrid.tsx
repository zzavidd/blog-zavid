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
  const [, setContext] = useContext(WishlistPageContext);
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

  /**
   * Opens the form and populates fields with the information of the item clicked.
   * @param wishlistItem The item to edit.
   */
  function onEditIconClick(wishlistItem: WishlistDAO.Response) {
    consign({
      isFormTrayOpen: true,
      selectedWishlistItem: wishlistItem,
      wishlistItem,
    });
  }

  /**
   * Prompts to delete the focused wishlist item.
   * @param wishlistItem The wishlist item to delete.
   */
  function onDeleteIconClick(wishlistItem: WishlistDAO.Response) {
    consign({
      isDeletePromptVisible: true,
      selectedWishlistItem: wishlistItem,
    });
  }

  /**
   * Opens the link in a new tab for the focused wishlist item.
   * @param url The URL to open.
   */
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
                      onClick={() => onDeleteIconClick(wishlistItem)}
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
