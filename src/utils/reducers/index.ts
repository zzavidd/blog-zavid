/* eslint-disable @typescript-eslint/no-empty-interface */
import type { PaletteMode } from '@mui/material';
import { WishlistVisibility, type Prisma } from '@prisma/client';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import localStorage from 'redux-persist/lib/storage';

import * as reducers from './functions';

export const InitialAppState: AppState = {
  theme: 'dark',
  diary: {
    sort: { entryNumber: 'desc' },
    filter: { categories: {} },
  },
  wishlist: {
    params: {
      where: {
        visibility: { in: [WishlistVisibility.PUBLIC] },
        purchaseDate: null,
      },
      orderBy: { createTime: 'desc' },
    },
  },
  postAdmin: {
    sort: { createTime: 'desc' },
    filter: {
      status: undefined,
      type: undefined,
    },
  },
};

const slice = createSlice({
  name: 'local',
  initialState: InitialAppState,
  reducers,
});

export const store = configureStore({
  reducer: persistReducer(
    { key: 'local', version: 1, storage: localStorage },
    slice.reducer,
  ),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);

export const AppActions = { ...slice.actions };

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export interface AppState {
  theme: PaletteMode;
  diary: {
    sort: Prisma.DiaryOrderByWithRelationAndSearchRelevanceInput;
    filter: Prisma.DiaryWhereInput;
  };
  wishlist: {
    params: WishlistReduxParams;
  };
  postAdmin: {
    sort: Prisma.PostOrderByWithRelationAndSearchRelevanceInput;
    filter: Prisma.PostWhereInput;
  };
}

export interface WishlistReduxParams
  extends Omit<WishlistFindManyInput, 'orderBy'> {
  orderBy: Prisma.WishlistItemOrderByWithRelationAndSearchRelevanceInput;
}

type AppDispatch = typeof store.dispatch;
