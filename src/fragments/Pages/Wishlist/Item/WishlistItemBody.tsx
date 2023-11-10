import { MoreVert } from '@mui/icons-material';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Box,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  alpha,
  useTheme,
  type PaletteColor,
} from '@mui/material';
import immutate from 'immutability-helper';
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import React, { useContext } from 'react';

import { AdminLock } from 'fragments/AdminGateway';

import { TrayFormContent, WishlistContext } from '../WishlistContext';

import {
  WishlistItemContext,
  useWishlistItemState,
} from './WishlistItem.utils';

export default function ItemBody() {
  const wishlistItem = useContext(WishlistItemContext);

  return (
    <CardContent
      sx={{
        borderTop: (t) => `2px solid ${alpha(t.palette.secondary.dark, 0.2)}`,
        flex: 1,
      }}>
      <Stack alignItems={'flex-end'} pl={2} sx={{ float: 'right' }}>
        <PriorityChip />
        <VisibilityIndicator />
        <AdminMenuTrigger />
      </Stack>
      <Typography
        color={'primary.light'}
        fontWeight={800}
        lineHeight={1.4}
        pb={1}>
        {wishlistItem.name}
      </Typography>
      <PriceAndCategory />
      <PurchasedOrDetails />
      <Comments />
    </CardContent>
  );
}

/**
 * The chip with the priority label.
 */
function PriorityChip() {
  const wishlistItem = useContext(WishlistItemContext);
  const { isPurchased } = useWishlistItemState();

  if (isPurchased) return null;
  return (
    <Typography
      variant={'overline'}
      lineHeight={1.5}
      fontWeight={'bold'}
      fontSize={10}>
      {wishlistItem.priority}
    </Typography>
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
      <VisibilityOffIcon fontSize={'large'} color={'primary'} />
    </Tooltip>
  );
}

/**
 * The price and category text.
 */
function PriceAndCategory() {
  const [context] = useContext(WishlistContext);
  const wishlistItem = useContext(WishlistItemContext);

  const price = wishlistItem.price.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
  });

  const showCategory = Boolean(
    context.categories &&
      wishlistItem.categoryId &&
      context.categories[wishlistItem.categoryId],
  );

  return (
    <Stack direction={'row'} alignItems={'center'} columnGap={1}>
      <Typography fontSize={16} fontWeight={800} m={0}>
        {price}
      </Typography>
      {showCategory && wishlistItem.categoryId ? (
        <React.Fragment>
          <Typography fontSize={11} fontWeight={800}>
            &bull;
          </Typography>
          <Typography
            variant={'overline'}
            fontSize={11}
            fontWeight={800}
            lineHeight={1.5}>
            {context.categories[wishlistItem.categoryId].name}
          </Typography>
        </React.Fragment>
      ) : null}
    </Stack>
  );
}

/**
 * Either displays the item's details or a note indicating that the item has
 * already been purchased.
 */
function PurchasedOrDetails() {
  const wishlistItem = useContext(WishlistItemContext);
  const { isPrivate, isPurchased, numberOfItemsClaimed, allQuantityClaimed } =
    useWishlistItemState();
  const theme = useTheme();

  if (isPurchased) {
    return <Typography variant={'overline'}>Already purchased.</Typography>;
  }

  const mode: keyof PaletteColor =
    theme.palette.mode === 'light' ? 'dark' : 'light';

  return (
    <Box py={2}>
      <Typography variant={'body2'} fontSize={13}>
        {wishlistItem.quantity}&nbsp;wanted
      </Typography>
      {isPrivate ? null : (
        <Typography
          variant={'body2'}
          color={(t) =>
            allQuantityClaimed
              ? t.palette.success[mode]
              : t.palette.warning[mode]
          }
          fontWeight={(t) => (t.palette.mode === 'light' ? 600 : 500)}
          fontSize={13}>
          {numberOfItemsClaimed} out of {wishlistItem.quantity}
          &nbsp;claimed
        </Typography>
      )}
    </Box>
  );
}

function Comments() {
  const wishlistItem = useContext(WishlistItemContext);
  const { isPurchased } = useWishlistItemState();
  if (!wishlistItem.comments || isPurchased) return null;
  return (
    <Typography
      variant={'body2'}
      fontSize={12}
      sx={{
        backgroundColor: (t) =>
          alpha(
            t.palette.secondary.main,
            t.palette.mode === 'light' ? 0.05 : 0.125,
          ),
        borderLeft: (t) => `4px solid ${t.palette.secondary.dark}`,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        mt: 1,
        px: 3,
        py: 2,
      }}>
      <SmsOutlinedIcon sx={{ float: 'left', fontSize: 14, mr: 1 }} />
      {wishlistItem.comments}
    </Typography>
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
      <IconButton {...bindTrigger(popupState)} sx={{ mt: 2 }}>
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
    </AdminLock>
  );
}
