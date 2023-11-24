import { WishlistVisibility, type WishlistItem } from '@prisma/client';
import React, { useContext } from 'react';

import { useSessionEmail } from 'utils/hooks';
import { useAppSelector } from 'utils/reducers';

export const WishlistItemContext = React.createContext<WishlistItem>(
  {} as WishlistItem,
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useWishlistItemState() {
  const wishlistItem = useContext(WishlistItemContext);
  const sessionUserEmail = useSessionEmail();
  const wishlistUserEmail = useAppSelector((state) => state.wishlist.email);

  const email = wishlistUserEmail || sessionUserEmail;
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

export function useWishlistUserEmail(): string {
  const wishlistUserEmail = useAppSelector((state) => state.wishlist.email);
  const sessionUserEmail = useSessionEmail();
  return wishlistUserEmail || sessionUserEmail || '';
}
