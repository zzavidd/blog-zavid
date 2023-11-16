import { Box, Button, Typography } from '@mui/material';
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import { useSnackbar } from 'notistack';
import React, { useContext } from 'react';

import { ActionDialog } from 'components/Dialog';
import { useSessionEmail } from 'utils/hooks';
import { trpc } from 'utils/trpc';

import { WishlistItemContext } from '../WishlistItem.utils';

export default function UnclaimTrigger() {
  const wishlistItem = useContext(WishlistItemContext);
  const { enqueueSnackbar } = useSnackbar();

  const userEmail = useSessionEmail();
  const trpcContext = trpc.useUtils();

  const { mutate: unclaimWishlistItem, isLoading } =
    trpc.wishlist.unclaim.useMutation({
      onSuccess: () => {
        void trpcContext.wishlist.findMany.refetch();
        enqueueSnackbar(
          `You have removed your claim on "${wishlistItem.name}".`,
          { variant: 'success' },
        );
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });

  function onUnclaim() {
    if (userEmail) {
      unclaimWishlistItem({ id: wishlistItem.id, email: userEmail });
    } else {
      enqueueSnackbar('You are not signed in.', { variant: 'error' });
    }
  }

  const modalState = usePopupState({
    variant: 'dialog',
    popupId: 'unclaimModal',
  });

  return (
    <React.Fragment>
      <Button
        color={'primary'}
        variant={'contained'}
        key={'unclaim'}
        size={'small'}
        {...bindTrigger(modalState)}>
        Unclaim
      </Button>
      <ActionDialog
        {...bindMenu(modalState)}
        maxWidth={'xs'}
        onConfirm={onUnclaim}
        onCancel={modalState.close}
        confirmText={'Remove claim'}
        isActionLoading={isLoading}
        isActionDestructive={true}>
        <Typography>
          Are you sure you want to remove your claim on&nbsp;
          <Box display={'inline'} fontWeight={'bold'}>
            &ldquo;{wishlistItem.name}&rdquo;
          </Box>
          ?
        </Typography>
      </ActionDialog>
    </React.Fragment>
  );
}
