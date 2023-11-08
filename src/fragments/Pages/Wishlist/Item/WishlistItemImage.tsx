import HideImageOutlinedIcon from '@mui/icons-material/HideImageOutlined';
import { Skeleton, Stack } from '@mui/material';
import React from 'react';
import useSWR from 'swr';

import { WishlistItemContext } from './WishlistItem.utils';

export function ItemImage() {
  const wishlistItem = React.useContext(WishlistItemContext);
  const { data, isLoading } = useSWR<string, Error, string>(
    wishlistItem.image,
    (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(url);
        img.src = url;
      });
    },
  );

  function RenderedImage() {
    if (isLoading) {
      return (
        <Skeleton variant={'rectangular'} width={'100%'} height={'100%'} />
      );
    }

    if (!data) {
      return (
        <HideImageOutlinedIcon
          color={'primary'}
          sx={{ height: '60%', width: '100%' }}
        />
      );
    }

    return (
      <img
        src={data}
        alt={wishlistItem.name}
        style={{ objectFit: 'cover', height: '100%', width: '100%' }}
      />
    );
  }

  return (
    <Stack
      width={'100%'}
      justifyContent={'center'}
      alignItems={'center'}
      maxHeight={(t) => t.spacing(12)}
      sx={{ aspectRatio: '1' }}>
      <RenderedImage />
    </Stack>
  );
}
