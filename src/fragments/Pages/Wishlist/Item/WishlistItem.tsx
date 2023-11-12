import { MoreVert } from '@mui/icons-material';
import type { SxProps, Theme } from '@mui/material';
import { Card, IconButton, Menu, MenuItem, Paper, alpha } from '@mui/material';
import type { WishlistItem } from '@prisma/client';
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
import ItemBody from './WishlistItemBody';
import ItemFooter from './WishlistItemFooter';
import { ItemImage } from './WishlistItemImage';

const WishlistGridItem = React.memo(function WishlistGridItem({
  wishlistItem,
}: WishlistGridItemProps) {
  return (
    <WishlistItemContext.Provider value={wishlistItem}>
      <WishlistGridItemContent />
    </WishlistItemContext.Provider>
  );
});

export default WishlistGridItem;

function WishlistGridItemContent() {
  const wishlistItem = useContext(WishlistItemContext);
  const { allQuantityClaimed } = useWishlistItemState();

  const cardContentSx: SxProps<Theme> = {
    backgroundColor: (t) =>
      wishlistItem.purchaseDate
        ? t.palette.card.purchased
        : allQuantityClaimed
        ? t.palette.card.claimed
        : t.palette.card.default,
    border: (t) => `4px solid ${alpha(t.palette.secondary.dark, 0.2)}`,
    transition: (t) =>
      t.transitions.create('all', {
        duration: t.transitions.duration.standard,
      }),
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
  };

  return (
    <Card sx={cardContentSx}>
      <AdminMenuTrigger />
      <ItemImage />
      <ItemBody />
      <ItemFooter />
    </Card>
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
    <AdminLock>
      <Paper>
        <IconButton
          {...bindTrigger(popupState)}
          sx={{
            mt: 2,
            position: 'absolute',
            right: (t) => t.spacing(2),
            top: 0,
          }}>
          <MoreVert />
        </IconButton>
      </Paper>
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
    </AdminLock>
  );
}

interface WishlistGridItemProps {
  wishlistItem: WishlistItem;
}
