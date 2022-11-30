import React from 'react';

import { WishlistStatic } from 'classes/wishlist/WishlistStatic';

export interface WishlistPageState {
  wishlistItemRequest: WishlistDAO;
  claimRequest: WishlistClaimRequest;
  selectedWishlistItem: WishlistDAO | null;
  isDeletePromptVisible: boolean;
  isClaimPromptVisible: boolean;
  isFormTrayOpen: boolean;
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
};

export const WishlistPageContext = React.createContext<
  [WishlistPageState, ReactHook<WishlistPageState>]
>([initialState, () => {}]);
