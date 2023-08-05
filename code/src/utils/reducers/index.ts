/* eslint-disable @typescript-eslint/no-empty-interface */
import type { PaletteMode } from '@mui/material';
import type { Prisma } from '@prisma/client';
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

const initialState: AppState = {
  theme: 'dark',
  diary: {
    sort: { entryNumber: 'desc' },
    filter: { categories: {} },
  },
  postAdmin: {
    sort: { createTime: 'desc' },
    filter: {
      status: undefined,
      type: undefined,
    },
  },
  subscribers: {
    announcement: [],
  },
};

const slice = createSlice({
  name: 'local',
  initialState,
  reducers,
});

export const store = configureStore({
  reducer: persistReducer(
    {
      key: 'local',
      version: 1,
      storage: localStorage,
    },
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
    sort: Prisma.DiaryOrderByWithRelationInput;
    filter: Prisma.DiaryWhereInput;
  };
  postAdmin: {
    sort: Prisma.PostOrderByWithRelationInput;
    filter: Prisma.PostWhereInput;
  };
  subscribers: {
    announcement: SubscriberAnnouncement[];
  };
}

type AppDispatch = typeof store.dispatch;
