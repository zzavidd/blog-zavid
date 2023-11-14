import { MoreVert, VisibilityOff } from '@mui/icons-material';
import { CardHeader, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import immutate from 'immutability-helper';
import { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { usePopupState } from 'material-ui-popup-state/hooks';
import React, { useContext } from 'react';

import { AdminLock } from 'fragments/AdminGateway';

import { TrayFormContent, WishlistContext } from '../WishlistContext';

import {
  WishlistItemContext,
  useWishlistItemState,
} from './WishlistItem.utils';

export default function ItemHeader() {
  return (
    <AdminLock>
      <CardHeader
        avatar={<VisibilityIndicator />}
        action={<AdminMenuTrigger />}
        sx={{ borderBottom: (t) => `2px solid ${t.palette.divider}` }}
      />
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

  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'wishlistItemMenu',
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
    popupState.close();
  }

  const menuItems = [
    { label: 'Edit', onClick: onEditButtonClick },
    { label: 'Delete', onClick: onEditButtonClick },
  ];

  return (
    <React.Fragment>
      <IconButton {...bindTrigger(popupState)}>
        <MoreVert />
      </IconButton>
      <Menu {...bindMenu(popupState)}>
        {menuItems.map(({ label, onClick }) => (
          <MenuItem
            onClick={onClick}
            sx={{ minWidth: (t) => t.spacing(10), p: 4 }}
            key={label}>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
}

/**
 * Prompts to delete the focused wishlist item.
 */
// function onDelete() {
//   setContext((current) =>
//     immutate(current, {
//       isDeletePromptVisible: { $set: true },
//       selectedWishlistItem: { $set: wishlistItem },
//     }),
//   );
// }
