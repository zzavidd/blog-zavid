import React from 'react';

import type WishlistDAO from 'classes/wishlist/WishlistDAO';
import { WishlistStatic } from 'classes/wishlist/WishlistStatic';
import type { ReactHook } from 'constants/types';

export interface WishlistPageState {
  wishlistItem: WishlistDAO.Request;
  selectedWishlistItemId: number | null;
  isDeletePromptVisible: boolean;
  isFormDrawOpen: boolean;
}

export const initialState: WishlistPageState = {
  wishlistItem: WishlistStatic.initial(),
  selectedWishlistItemId: null,
  isDeletePromptVisible: false,
  isFormDrawOpen: false,
};

export const WishlistPageContext = React.createContext<
  [WishlistPageState, ReactHook<WishlistPageState>]
>([initialState, () => {}]);
