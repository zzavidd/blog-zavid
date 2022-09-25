import { useContext, useState } from 'react';
import { mutate } from 'swr';

import Alert from 'constants/alert';
import Utils from 'constants/utils';
import Validate from 'constants/validations';
import AdminLock from 'fragments/AdminLock';
import WL from 'stylesv2/Wishlist.styles';

import { WishlistPageContext } from './WishlistContext';
import WishlistForm from './WishlistForm';

export default function WishlistTray() {
  const [state, setState] = useState({ isRequestPending: false });
  const [context, setContext] = useContext(WishlistPageContext);
  const consign = Utils.createDispatch(setContext);

  /**
   * Submits the wishlist item.
   */
  async function submitWishlistItem() {
    try {
      setState({ isRequestPending: true });
      Validate.wishlistItem(context.wishlistItem);

      await Utils.request('/api/wishlist', {
        method: 'POST',
        body: JSON.stringify({ wishlistItem: context.wishlistItem }),
      });
      await mutate('/api/wishlist');
      Alert.success("You've successfully added a new wishlist item.");
      consign({ isFormDrawOpen: false });
    } catch (e: any) {
      Alert.error(e.message);
    } finally {
      setState({ isRequestPending: false });
    }
  }

  /**
   * Updates the selected wishlist item.
   */
  async function updateWishlistItem() {
    try {
      setState({ isRequestPending: true });
      Validate.wishlistItem(context.wishlistItem);

      await Utils.request('/api/wishlist', {
        method: 'PUT',
        body: JSON.stringify({
          id: context.wishlistItem.id,
          wishlistItem: context.wishlistItem,
        }),
      });
      await mutate('/api/wishlist');
      Alert.success(
        `You've successfully edited '${context.wishlistItem.name}'.`,
      );
      consign({ isFormDrawOpen: false });
    } catch (e: any) {
      Alert.error(e.message);
    } finally {
      setState({ isRequestPending: false });
    }
  }

  function displayButtonText(title: string) {
    return state.isRequestPending ? 'Loading...' : title;
  }

  return (
    <AdminLock>
      <WL.Tray open={context.isFormDrawOpen}>
        <WishlistForm />
        <WL.FormFooter>
          {context.selectedWishlistItemId === null ? (
            <WL.FormSubmitButton onClick={submitWishlistItem}>
              {displayButtonText('Submit')}
            </WL.FormSubmitButton>
          ) : (
            <WL.FormSubmitButton
              onClick={updateWishlistItem}
              disabled={!context.selectedWishlistItemId}>
              {displayButtonText('Update')}
            </WL.FormSubmitButton>
          )}
          <WL.FormCancelButton
            onClick={() => consign({ isFormDrawOpen: false })}>
            Close
          </WL.FormCancelButton>
        </WL.FormFooter>
      </WL.Tray>
    </AdminLock>
  );
}
