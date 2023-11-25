import {
  Archive,
  AttachEmail,
  Delete,
  Edit,
  Email,
  MoreVert,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Typography,
} from '@mui/material';
import { WishlistVisibility } from '@prisma/client';
import immutate from 'immutability-helper';
import { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { useSnackbar } from 'notistack';
import React, { useContext } from 'react';

import { ActionDialog } from 'components/Dialog';
import { useIsAdmin } from 'utils/hooks';
import { trpc } from 'utils/trpc';

import { TrayFormContent, WishlistContext } from '../../WishlistContext';
import {
  WishlistItemContext,
  useWishlistItemState,
} from '../WishlistItem.utils';

export default function AdminMenuTrigger() {
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
  const { mutate: notifyWishlistItem } = trpc.wishlist.notify.useMutation();
  const { isClaimedByUser } = useWishlistItemState();

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

  function onPreviewEtherealClick() {
    notifyWishlistItem(
      { id: wishlistItem.id, type: 'Ethereal' },
      { onSuccess: (url) => window.open(url, '_blank') },
    );
  }

  function onPreviewGmailClick() {
    notifyWishlistItem(
      { id: wishlistItem.id, type: 'Gmail' },
      {
        onSuccess: () => {
          enqueueSnackbar(
            `Successfully sent "${wishlistItem.name}" to administrator email.`,
            { variant: 'success' },
          );
          modalState.close();
        },
      },
    );
  }

  const menuItems = [
    { label: 'Edit', Icon: Edit, onClick: onEditButtonClick },
    { label: 'Delete', Icon: Delete, onClick: onDeleteButtonClick },
    { label: 'Archive', Icon: Archive, onClick: onArchiveButtonClick },
    {
      label: 'Preview Ethereal',
      Icon: Email,
      onClick: onPreviewEtherealClick,
    },
    {
      label: 'Preview Gmail',
      Icon: AttachEmail,
      onClick: onPreviewGmailClick,
    },
  ];

  if (!isAdmin) return null;

  return (
    <React.Fragment key={'admin'}>
      <Button
        variant={'contained'}
        color={isClaimedByUser ? 'secondary' : 'primary'}
        {...bindTrigger(menuState)}
        size={'small'}
        sx={{ flex: 0, p: 0 }}>
        <MoreVert />
      </Button>
      <Menu {...bindMenu(menuState)} sx={{ maxWidth: (t) => t.spacing(15) }}>
        <Typography fontSize={'90%'} m={4}>
          Do what with&nbsp;
          <Box display={'inline'} fontWeight={900} component={'span'}>
            {wishlistItem.name}
          </Box>
          ?
        </Typography>
        <Divider />
        <MenuList disablePadding={true}>
          {menuItems.map(({ label, onClick, Icon }) => (
            <MenuItem onClick={onClick} key={label} sx={{ px: 4, py: 3 }}>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText>{label}</ListItemText>
              <ListItemIcon />
            </MenuItem>
          ))}
        </MenuList>
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
          <Box display={'inline'} fontWeight={'bold'} component={'span'}>
            &ldquo;{wishlistItem.name}&rdquo;
          </Box>
          ?
        </Typography>
      </ActionDialog>
    </React.Fragment>
  );
}
