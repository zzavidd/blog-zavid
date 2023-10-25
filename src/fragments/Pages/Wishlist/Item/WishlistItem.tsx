import type { SxProps, Theme } from '@mui/material';
import {
  Card,
  CardContent,
  Skeleton,
  Stack,
  alpha,
  useTheme,
} from '@mui/material';
import type { WishlistItem } from '@prisma/client';
import React, { useContext } from 'react';

import {
  WishlistItemContext,
  useImageLoaded,
  useWishlistItemState,
} from './WishlistItem.utils';
import ItemBody from './WishlistItemBody';
import ItemFooter from './WishlistItemFooter';
import { ItemImage } from './WishlistItemImage';

const WishlistGridItem = React.memo(
  function WishlistGridItem({ wishlistItem }: WishlistGridItemProps) {
    return (
      <WishlistItemContext.Provider value={wishlistItem}>
        <WishlistGridItemContent />
      </WishlistItemContext.Provider>
    );
  },
  (a, b) => a.wishlistItem.id === b.wishlistItem.id,
);

export default WishlistGridItem;

function WishlistGridItemContent() {
  const wishlistItem = useContext(WishlistItemContext);
  const { allQuantityClaimed } = useWishlistItemState();
  const imageLoaded = useImageLoaded(wishlistItem.image);

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
  };

  if (wishlistItem.image && !imageLoaded) {
    return <PlaceholderItem />;
  }

  return (
    <Card sx={cardContentSx}>
      <ItemImage />
      <ItemBody />
      <ItemFooter />
    </Card>
  );
}

export function PlaceholderItem() {
  const theme = useTheme();
  return (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant={'rectangular'} height={theme.spacing(12)} />
      <CardContent>
        <Stack>
          <Skeleton
            variant={'text'}
            height={theme.spacing(7)}
            width={theme.spacing(11)}
          />
          <Skeleton variant={'text'} width={theme.spacing(10)} />
          <Skeleton variant={'text'} width={theme.spacing(9)} />
        </Stack>
        <Skeleton
          variant={'rounded'}
          height={theme.spacing(6)}
          width={'100%'}
        />
      </CardContent>
    </Card>
  );
}

interface WishlistGridItemProps {
  wishlistItem: WishlistItem;
}
