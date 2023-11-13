import type { SxProps, Theme } from '@mui/material';
import { Card, alpha } from '@mui/material';
import type { WishlistItem } from '@prisma/client';
import React, { useContext } from 'react';

import {
  WishlistItemContext,
  useWishlistItemState,
} from './WishlistItem.utils';
import ItemBody from './WishlistItemBody';
import ItemFooter from './WishlistItemFooter';
import ItemHeader from './WishlistItemHeader';
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
      <ItemHeader />
      <ItemImage />
      <ItemBody />
      <ItemFooter />
    </Card>
  );
}

interface WishlistGridItemProps {
  wishlistItem: WishlistItem;
}
