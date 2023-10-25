import { Button, Dialog, DialogActions } from '@mui/material';
import React, { useEffect } from 'react';
import * as SWR from 'swr';

import ClaimForm from 'fragments/Forms/ClaimForm';
import { Route } from 'utils/constants';
import Contexts, { INITIAL_STATE, WishlistPageContext } from 'utils/contexts';
import Utils from 'utils/functions';
import { zClaimUpsert } from 'utils/validations';

export default function ClaimItemModal() {
  const [context, setContext] = React.useContext(WishlistPageContext);
  const consign = Utils.createDispatch(setContext);
  const Snacks = React.useContext(Contexts.Snacks);

  useEffect(() => {
    if (context.isClaimPromptVisible) {
      consign({ claimRequest: INITIAL_STATE.claimRequest });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.isClaimPromptVisible]);

  /**
   * Claims an item by assigning a reservee to it.
   */
  async function claimItem() {
    const { claimRequest, selectedWishlistItem } = context;
    try {
      zClaimUpsert.parse(claimRequest);
      if (!selectedWishlistItem) {
        throw new Error('No wishlist item selected.');
      }

      const showSuccessMessage = () => {
        Snacks.success(
          `You have claimed "${selectedWishlistItem.name}". Check your email address for confirmation and more details.`,
        );
      };

      await Utils.request<ItemPayload.Claim>(Route.WishlistClaim, {
        method: 'PUT',
        body: {
          id: selectedWishlistItem.id!,
          email: claimRequest.emailAddress,
          quantity: claimRequest.quantity,
          anonymous: claimRequest.isAnonymous,
        },
      });
      // dispatch(AppActions.setUserEmail(claimRequest.emailAddress));
      await SWR.mutate(Route.Wishlist);

      consign({ isClaimPromptVisible: false });
      showSuccessMessage();
    } catch (e: any) {
      Snacks.error(e.message);
    }
  }

  /**
   * Closes the claim prompt.
   */
  function onCancel() {
    consign({ isClaimPromptVisible: false });
  }

  return (
    <Dialog open={context.isClaimPromptVisible} onClose={onCancel}>
      <ClaimForm />
      <DialogActions>
        <Button variant={'contained'} onClick={claimItem}>
          Claim
        </Button>
        <Button variant={'outlined'} onClick={onCancel}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
