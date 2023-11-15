import { Archive, Delete, Edit, MoreVert } from '@mui/icons-material';
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { WishlistVisibility } from '@prisma/client';
import immutate from 'immutability-helper';
import { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import React, { useContext } from 'react';

import { ActionDialog } from 'components/Dialog';
import { useIsAdmin } from 'utils/hooks';
import { trpc } from 'utils/trpc';

import { TrayFormContent, WishlistContext } from '../WishlistContext';

import {
  WishlistItemContext,
  useWishlistItemState,
} from './WishlistItem.utils';

export default function WishlistItemFooterContent() {
  const buttons = [LinkButton, ActionButton, AdminMenuTrigger].filter((e) => e);

  return (
    <React.Fragment>
      {buttons.length > 1 ? (
        <ButtonGroup fullWidth={true}>
          {buttons.map((ButtonEntry) => ButtonEntry())}
        </ButtonGroup>
      ) : (
        buttons[0]()
      )}
    </React.Fragment>
  );
}

function LinkButton() {
  const wishlistItem = useContext(WishlistItemContext);
  if (!wishlistItem.href) return null;
  return (
    <Button
      color={'primary'}
      href={wishlistItem.href}
      target={'_blank'}
      rel={'noopener'}
      key={'link'}
      size={'small'}>
      Visit link
    </Button>
  );
}

function ActionButton() {
  const wishlistItem = useContext(WishlistItemContext);
  const [, setContext] = useContext(WishlistContext);
  const { enqueueSnackbar } = useSnackbar();

  const session = useSession();
  const { isPurchased, isPrivate, allQuantityClaimed, isClaimedByUser } =
    useWishlistItemState();

  const { mutate: unclaimWishlistItem } = trpc.wishlist.unclaim.useMutation({
    onSuccess: () => {
      enqueueSnackbar(
        `You have removed your claim on "${wishlistItem.name}".`,
        { variant: 'success' },
      );
    },
    onError: (e) => {
      enqueueSnackbar(e.message, { variant: 'error' });
    },
  });

  /**
   * Claims an item by assigning a reservee to it.
   */
  function onClaim() {
    setContext((c) =>
      immutate(c, {
        isClaimPromptVisible: { $set: true },
        selectedWishlistItem: { $set: wishlistItem },
      }),
    );
  }

  function onUnclaim() {
    const email = session.data?.user?.email;
    if (email) {
      unclaimWishlistItem({ id: wishlistItem.id, email });
    } else {
      enqueueSnackbar('You are not signed in.', { variant: 'error' });
    }
  }

  const allClaimedByOthers = allQuantityClaimed && !isClaimedByUser;
  const hideEitherClaimButton = isPurchased || isPrivate || allClaimedByOthers;

  if (hideEitherClaimButton) {
    return null;
  }

  if (isClaimedByUser) {
    return (
      <Button
        color={'primary'}
        variant={'contained'}
        onClick={onUnclaim}
        key={'unclaim'}
        size={'small'}>
        Unclaim
      </Button>
    );
  }

  return (
    <React.Fragment>
      <Button
        color={'primary'}
        variant={'contained'}
        onClick={onClaim}
        key={'claim'}
        size={'small'}>
        Claim
      </Button>
    </React.Fragment>
  );
}

function AdminMenuTrigger() {
  const [, setContext] = useContext(WishlistContext);
  const wishlistItem = useContext(WishlistItemContext);
  const isAdmin = useIsAdmin();

  const menuState = usePopupState({
    variant: 'popover',
    popupId: 'wishlistItemMenu',
  });
  const modalState = usePopupState({
    variant: 'dialog',
    popupId: 'deleteConfirmModal',
  });
  const { enqueueSnackbar } = useSnackbar();
  const trpcContext = trpc.useUtils();
  const { mutate: deleteWishlistItem, isLoading: isDeleteLoading } =
    trpc.wishlist.delete.useMutation({
      onSuccess: () => {
        void trpcContext.wishlist.findMany.refetch();
        enqueueSnackbar(`You've successfully deleted "${wishlistItem.name}".`, {
          variant: 'success',
        });
        modalState.close();
      },
      onError: (e) => {
        enqueueSnackbar(e.message, { variant: 'error' });
      },
    });
  const { mutate: archiveWishlistItem } = trpc.wishlist.update.useMutation({
    onSuccess: () => {
      void trpcContext.wishlist.findMany.refetch();
      enqueueSnackbar(`You've successfully archived "${wishlistItem.name}".`, {
        variant: 'success',
      });
    },
    onError: (e) => {
      enqueueSnackbar(e.message, { variant: 'error' });
    },
  });

  /**
   * Opens the form tray with wishlist form when clicked.
   */
  function onEditButtonClick() {
    setContext((current) =>
      immutate(current, {
        trayFormContent: { $set: TrayFormContent.WISHLIST_ITEM },
        selectedWishlistItem: { $set: wishlistItem },
        wishlistItemRequest: {
          $set: {
            ...wishlistItem,
            price: wishlistItem.price.toFixed(2) as unknown as number,
            reservees: wishlistItem.reservees as WishlistReservees,
          },
        },
      }),
    );
    menuState.close();
  }

  function onDeleteButtonClick() {
    menuState.close();
    modalState.open();
  }

  function onArchiveButtonClick() {
    menuState.close();
    archiveWishlistItem({
      data: { visibility: WishlistVisibility.ARCHIVED },
      where: { id: wishlistItem.id },
    });
  }

  /**
   * Prompts to delete the focused wishlist item.
   */
  function onDelete() {
    deleteWishlistItem({ where: { id: wishlistItem.id } });
  }

  const menuItems = [
    { label: 'Edit', Icon: Edit, onClick: onEditButtonClick },
    { label: 'Delete', Icon: Delete, onClick: onDeleteButtonClick },
    { label: 'Archive', Icon: Archive, onClick: onArchiveButtonClick },
  ];

  if (!isAdmin) return null;

  return (
    <React.Fragment key={'admin'}>
      <Button
        variant={'contained'}
        {...bindTrigger(menuState)}
        size={'small'}
        sx={{ flex: 0, p: 0 }}>
        <MoreVert />
      </Button>
      <Menu {...bindMenu(menuState)} sx={{ maxWidth: (t) => t.spacing(14) }}>
        <Typography fontSize={'90%'} m={4}>
          Do what with&nbsp;
          <Box display={'inline'} fontWeight={900}>
            {wishlistItem.name}
          </Box>
          ?
        </Typography>
        <Divider />
        {menuItems.map(({ label, onClick, Icon }) => (
          <MenuItem onClick={onClick} key={label}>
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText>{label}</ListItemText>
            <ListItemIcon />
          </MenuItem>
        ))}
      </Menu>
      <ActionDialog
        {...bindMenu(modalState)}
        onConfirm={onDelete}
        onCancel={modalState.close}
        confirmText={'Delete'}
        isActionDestructive={true}
        isActionLoading={isDeleteLoading}>
        <Typography>
          Are you sure you want to delete&nbsp;
          <Box display={'inline'} fontWeight={'bold'}>
            &ldquo;{wishlistItem.name}&rdquo;
          </Box>
          ?
        </Typography>
      </ActionDialog>
    </React.Fragment>
  );
}
