import { useContext, useState } from 'react';
import { mutate } from 'swr';

import Contexts from 'constants/contexts';
import Utils from 'constants/utils';
import Validate from 'constants/validations';
import AdminLock from 'fragments/AdminLock';
import WL from 'stylesv2/Pages/Wishlist.styles';

import { WishlistPageContext } from './WishlistContext';
import WishlistForm from './WishlistForm';

export default function WishlistTray() {
  const [state, setState] = useState({ isRequestPending: false });
  const [context, setContext] = useContext(WishlistPageContext);
  const consign = Utils.createDispatch(setContext);
  const Alerts = useContext(Contexts.Alerts);

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
      Alerts.success("You've successfully added a new wishlist item.");
      consign({ isFormTrayOpen: false });
    } catch (e: any) {
      Alerts.error(e.message);
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
      Alerts.success(
        `You've successfully edited '${context.wishlistItem.name}'.`,
      );
      consign({ isFormTrayOpen: false });
    } catch (e: any) {
      Alerts.error(e.message);
    } finally {
      setState({ isRequestPending: false });
    }
  }

  function displayButtonText(title: string) {
    return state.isRequestPending ? 'Loading...' : title;
  }

  return (
    <AdminLock>
      <WL.Tray.Container open={context.isFormTrayOpen}>
        <WishlistForm />
        <WL.Tray.FormFooter>
          {context.selectedWishlistItem === null ? (
            <WL.Tray.FormSubmitButton onClick={submitWishlistItem}>
              {displayButtonText('Submit')}
            </WL.Tray.FormSubmitButton>
          ) : (
            <WL.Tray.FormSubmitButton
              onClick={updateWishlistItem}
              disabled={!context.selectedWishlistItem}>
              {displayButtonText('Update')}
            </WL.Tray.FormSubmitButton>
          )}
          <WL.Tray.FormCancelButton
            onClick={() => consign({ isFormTrayOpen: false })}>
            Close
          </WL.Tray.FormCancelButton>
        </WL.Tray.FormFooter>
      </WL.Tray.Container>
    </AdminLock>
  );
}
