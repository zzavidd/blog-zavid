import { WishlistVisibility, type WishlistItem } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React, { useContext } from 'react';

export const WishlistItemContext = React.createContext<WishlistItem>(
  {} as WishlistItem,
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
