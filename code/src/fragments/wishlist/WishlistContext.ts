import React from 'react';

import type WishlistDAO from 'classes/wishlist/WishlistDAO';
import { WishlistStatic } from 'classes/wishlist/WishlistStatic';
import type { ReactHook } from 'constants/types';

export interface WishlistPageState {
  wishlistItem: WishlistDAO.Request;
  selectedWishlistItem: WishlistDAO.Response | null;
  isDeletePromptVisible: boolean;
  isFormTrayOpen: boolean;
}

export const initialState: WishlistPageState = {
  wishlistItem: WishlistStatic.initial(),
  selectedWishlistItem: null,
  isDeletePromptVisible: false,
  isFormTrayOpen: false,
};

export const WishlistPageContext = React.createContext<
  [WishlistPageState, ReactHook<WishlistPageState>]
>([initialState, () => {}]);
