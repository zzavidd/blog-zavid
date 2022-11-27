import { useContext, useState } from 'react';
import { mutate } from 'swr';

import Contexts from 'constants/contexts';
import Utils from 'constants/utils';
import Validate from 'constants/validations';
import AdminLock from 'fragments/AdminLock';
import FORM from 'styles/Components/Form.styles';
import WL from 'styles/Pages/Wishlist.styles';

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
      Validate.wishlistItem(context.wishlistItemRequest);

      await Utils.request('/api/wishlist', {
        method: 'POST',
        body: JSON.stringify({ wishlistItem: context.wishlistItemRequest }),
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
      Validate.wishlistItem(context.wishlistItemRequest);

      await Utils.request('/api/wishlist', {
        method: 'PUT',
        body: JSON.stringify({
          id: context.wishlistItemRequest.id,
          wishlistItem: context.wishlistItemRequest,
        }),
      });
      await mutate('/api/wishlist');
      Alerts.success(
        `You've successfully edited '${context.wishlistItemRequest.name}'.`,
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
      <WL.Tray open={context.isFormTrayOpen}>
        <WishlistForm />
        <FORM.Footer>
          {context.selectedWishlistItem === null ? (
            <FORM.SubmitButton onClick={submitWishlistItem}>
              {displayButtonText('Submit')}
            </FORM.SubmitButton>
          ) : (
            <FORM.SubmitButton
              onClick={updateWishlistItem}
              disabled={!context.selectedWishlistItem}>
              {displayButtonText('Update')}
            </FORM.SubmitButton>
          )}
          <FORM.CancelButton onClick={() => consign({ isFormTrayOpen: false })}>
            Close
          </FORM.CancelButton>
        </FORM.Footer>
      </WL.Tray>
    </AdminLock>
  );
}
