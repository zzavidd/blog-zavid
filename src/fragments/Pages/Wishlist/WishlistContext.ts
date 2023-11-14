import {
  WishlistPriority,
  WishlistVisibility,
  type Prisma,
  type WishlistItem,
} from '@prisma/client';
import React from 'react';

export const InitialWishlistState: WishlistState = {
  categories: [],
  claimRequest: {
    id: 0,
    email: '',
    anonymous: false,
    quantity: 1,
  },
  isClaimPromptVisible: false,
  selectedWishlistItem: null,
  trayFormContent: null,
  wishlistItemRequest: {
    name: '',
    price: 0,
    quantity: 1,
    visibility: WishlistVisibility.PUBLIC,
    priority: WishlistPriority.LOW,
    comments: '',
    image: '',
    categoryId: null,
    href: '',
    reservees: {},
    purchaseDate: null,
  },
};

export const WishlistContext = React.createContext<
  ReactUseState<WishlistState>
>([InitialWishlistState, () => {}]);

export enum TrayFormContent {
  WISHLIST_ITEM = 1,
  CATEGORIES = 2,
  FILTERS = 3,
}

interface WishlistState {
  categories: WishlistCategoryWithCount[];
  claimRequest: WishlistClaimPayload;
  isClaimPromptVisible: boolean;
  selectedWishlistItem: WishlistItem | null;
  trayFormContent: TrayFormContent | null;
  wishlistItemRequest: Prisma.WishlistItemUncheckedCreateInput;
}
