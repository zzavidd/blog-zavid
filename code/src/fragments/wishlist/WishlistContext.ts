import React from 'react';

import type WishlistDAO from 'classes/wishlist/WishlistDAO';
import { WishlistStatic } from 'classes/wishlist/WishlistStatic';
import type { ReactHook } from 'constants/types';

export interface WishlistPageState {
  wishlistItem: WishlistDAO;
  claim: WishlistClaim;
  selectedWishlistItem: WishlistDAO | null;
  isDeletePromptVisible: boolean;
  isClaimPromptVisible: boolean;
  isFormTrayOpen: boolean;
}

export const initialState: WishlistPageState = {
  wishlistItem: WishlistStatic.initial(),
  claim: {
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

interface WishlistClaim {
  quantity: number;
  isAnonymous: boolean;
}
