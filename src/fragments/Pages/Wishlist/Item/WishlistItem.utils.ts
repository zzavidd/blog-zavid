import { WishlistVisibility, type WishlistItem } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React, { useContext, useEffect, useState } from 'react';

export const WishlistItemContext = React.createContext<WishlistItem>(
  {} as WishlistItem,
);

export function useWishlistItemState() {
  const wishlistItem = useContext(WishlistItemContext);
  const session = useSession();
  const email = session.data?.user?.email;

  const reservees = wishlistItem.reservees || ({} as WishlistReservees);

  const isClaimedByUser = email
    ? Object.keys(reservees).includes(email)
    : false;
  const numberOfItemsClaimed = Object.values(reservees).reduce(
    (acc, reservee) => acc + reservee.quantity,
    0,
  );

  const isPrivate = wishlistItem.visibility === WishlistVisibility.PRIVATE;
  const isPurchased = !!wishlistItem.purchaseDate;
  const allQuantityClaimed = numberOfItemsClaimed === wishlistItem.quantity;

  return {
    isClaimedByUser,
    numberOfItemsClaimed,
    isPrivate,
    isPurchased,
    allQuantityClaimed,
  };
}

/**
 * Hooks for checking if images have been loaded.
 * @param src The image source.
 * @returns True if the image has loaded.
 */
export function useImageLoaded(src: string): boolean {
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.src = src;
  }, [src]);

  return isLoaded;
}
