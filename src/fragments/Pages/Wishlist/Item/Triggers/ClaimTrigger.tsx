import { Button } from '@mui/material';
import { bindMenu } from 'material-ui-popup-state';
import { bindTrigger, usePopupState } from 'material-ui-popup-state/hooks';
import { useSnackbar } from 'notistack';
import React, { useContext } from 'react';

import { ActionDialog } from 'components/Dialog';
import { AppActions, useAppDispatch } from 'utils/reducers';
import { trpc } from 'utils/trpc';

import ClaimForm from '../../Forms/ClaimForm';
import { WishlistContext } from '../../WishlistContext';
import { WishlistItemContext } from '../WishlistItem.utils';

export default function ClaimTrigger() {
  const wishlistItem = useContext(WishlistItemContext);
  const [context] = useContext(WishlistContext);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();

  const trpcContext = trpc.useUtils();

  const { mutate: claimWishlistItem, isLoading: isClaimLoading } =
    trpc.wishlist.claim.useMutation({
      onSuccess: () => {
        dispatch(AppActions.setWishlistEmail(context.claimRequest.email));
        void trpcContext.wishlist.findMany.refetch();
        modalState.close();
        enqueueSnackbar(
          `You have successfully claimed "${wishlistItem.name}".`,
          { variant: 'success' },
        );
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });

  const modalState = usePopupState({
    variant: 'dialog',
    popupId: 'claimModal',
  });

  function onClaim() {
    claimWishlistItem({
      ...context.claimRequest,
      id: wishlistItem.id,
      quantity: Number(context.claimRequest.quantity),
    });
  }

  return (
    <React.Fragment>
      <Button
        color={'primary'}
        variant={'contained'}
        key={'claim'}
        size={'small'}
        {...bindTrigger(modalState)}>
        Claim
      </Button>
      <ActionDialog
        {...bindMenu(modalState)}
        maxWidth={'xs'}
        onConfirm={onClaim}
        onCancel={modalState.close}
        confirmText={'Claim'}
        isActionLoading={isClaimLoading}>
        <ClaimForm />
      </ActionDialog>
    </React.Fragment>
  );
}
