import React from 'react';

import type WishlistDAO from 'classes/wishlist/WishlistDAO';
import { WishlistStatic } from 'classes/wishlist/WishlistStatic';
import type { ReactHook } from 'constants/types';

export interface WishlistPageState {
  wishlistItemRequest: WishlistDAO;
  claimRequest: WishlistClaimRequest;
  selectedWishlistItem: WishlistDAO | null;
  isDeletePromptVisible: boolean;
  isClaimPromptVisible: boolean;
  isFormTrayOpen: boolean;
  hidePurchased: boolean;
}

export const initialState: WishlistPageState = {
  wishlistItemRequest: WishlistStatic.initial(),
  claimRequest: {
    quantity: 1,
    emailAddress: '',
    isAnonymous: false,
    honeypot: '',
  },
  selectedWishlistItem: null,
  isDeletePromptVisible: false,
  isClaimPromptVisible: false,
  isFormTrayOpen: false,
  hidePurchased: false,
};

export const WishlistPageContext = React.createContext<
  [WishlistPageState, ReactHook<WishlistPageState>]
>([initialState, () => {}]);
