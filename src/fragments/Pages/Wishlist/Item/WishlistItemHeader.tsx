import {
  Archive,
  Delete,
  Edit,
  MoreVert,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { WishlistVisibility } from '@prisma/client';
import immutate from 'immutability-helper';
import { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { useSnackbar } from 'notistack';
import React, { useContext } from 'react';

import { ActionDialog } from 'components/Dialog';
import { AdminLock } from 'fragments/AdminGateway';
import { trpc } from 'utils/trpc';

import { TrayFormContent, WishlistContext } from '../WishlistContext';

import {
  WishlistItemContext,
  useWishlistItemState,
} from './WishlistItem.utils';

export default function WishlistItemAdminControls() {
  return (
    <AdminLock>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        sx={{
          borderBottom: { xs: 0, md: (t) => `2px solid ${t.palette.divider}` },
          px: 3,
          py: 2,
        }}>
        <Box justifySelf={'flex-start'}>
          <VisibilityIndicator />
        </Box>
        <Box justifySelf={'flex-end'}>
          <AdminMenuTrigger />
        </Box>
      </Stack>
    </AdminLock>
  );
}

/**
 * The visibility indicator if necessary.
 */
function VisibilityIndicator() {
  const { isPrivate } = useWishlistItemState();
  if (!isPrivate) return null;
  return (
    <Tooltip title={'Only you can see this item.'}>
      <VisibilityOff fontSize={'large'} color={'primary'} />
    </Tooltip>
  );
}

function AdminMenuTrigger() {
  const [, setContext] = useContext(WishlistContext);
  const wishlistItem = useContext(WishlistItemContext);

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

  return (
    <React.Fragment>
      <IconButton {...bindTrigger(menuState)}>
        <MoreVert />
      </IconButton>
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
          <Typography display={'inline'} fontWeight={'bold'}>
            &ldquo;{wishlistItem.name}&rdquo;
          </Typography>
          ?
        </Typography>
      </ActionDialog>
    </React.Fragment>
  );
}
