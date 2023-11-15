import type { SxProps, Theme } from '@mui/material';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Stack,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { type WishlistItem } from '@prisma/client';
import React, { useContext } from 'react';

import {
  WishlistItemContext,
  useWishlistItemState,
} from './WishlistItem.utils';
import WishlistItemBodyContent from './WishlistItemBody';
import WishlistItemFooterContent from './WishlistItemFooter';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const cardContentSx: SxProps<Theme> = {
    backgroundColor: (t) =>
      wishlistItem.purchaseDate
        ? t.palette.card.purchased
        : allQuantityClaimed
          ? t.palette.card.claimed
          : t.palette.card.default,
    border: (t) => `4px solid ${alpha(t.palette.secondary.dark, 0.2)}`,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
    transition: (t) =>
      t.transitions.create('all', {
        duration: t.transitions.duration.standard,
      }),
  };

  if (isMobile) {
    return (
      <Card sx={cardContentSx}>
        <Stack direction={'row'}>
          <Box
            width={(t) => t.spacing(10)}
            height={'100%'}
            sx={{ aspectRatio: '1' }}>
            <ItemImage />
          </Box>
          <Stack flexGrow={1} p={4} rowGap={3}>
            <Box flexGrow={1}>
              <WishlistItemBodyContent />
            </Box>
            <Box flexGrow={1}>
              <WishlistItemFooterContent />
            </Box>
          </Stack>
        </Stack>
      </Card>
    );
  }

  return (
    <Card sx={cardContentSx}>
      <Box width={'100%'} height={(t) => t.spacing(12)} sx={{ aspectRatio: 1 }}>
        <ItemImage />
      </Box>
      <CardContent
        sx={{
          borderTop: (t) => `2px solid ${t.palette.divider}`,
          flex: 1,
        }}>
        <WishlistItemBodyContent />
      </CardContent>
      <CardActions sx={{ justifySelf: 'flex-end', pt: 1, px: 4, pb: 4 }}>
        <WishlistItemFooterContent />
      </CardActions>
    </Card>
  );
}

interface WishlistGridItemProps {
  wishlistItem: WishlistItem;
}
