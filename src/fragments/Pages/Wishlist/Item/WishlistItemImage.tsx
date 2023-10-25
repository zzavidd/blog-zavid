import HideImageOutlinedIcon from '@mui/icons-material/HideImageOutlined';
import { CardMedia, Stack } from '@mui/material';
import React from 'react';

import { WishlistItemContext } from './WishlistItem.utils';

export function ItemImage() {
  const wishlistItem = React.useContext(WishlistItemContext);

  if (!wishlistItem.image) {
    return (
      <Stack>
        <HideImageOutlinedIcon color={'secondary'} />
      </Stack>
    );
  }

  return (
    <CardMedia
      src={wishlistItem.image}
      title={wishlistItem.name}
      component={'img'}
    />
  );
}
