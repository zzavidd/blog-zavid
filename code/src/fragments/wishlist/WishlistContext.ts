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
}

export const initialState: WishlistPageState = {
  wishlistItemRequest: WishlistStatic.initial(),
  claimRequest: {
    quantity: 1,
    isAnonymous: false,
  },
  selectedWishlistItem: null,
  isDeletePromptVisible: false,
  isClaimPromptVisible: false,
  isFormTrayOpen: false,
};

export const WishlistPageContext = React.createContext<
  [WishlistPageState, ReactHook<WishlistPageState>]
>([initialState, () => {}]);

interface WishlistClaimRequest {
  quantity: number;
  isAnonymous: boolean;
}
