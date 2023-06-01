/* eslint-disable @typescript-eslint/no-empty-interface */
import type { PaletteMode } from '@mui/material';
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

const initialState: StoreState = {
  theme: 'dark',
};

const slice = createSlice({
  name: 'local',
  initialState: initialState,
  reducers,
});

export const store = configureStore({
  reducer: {
    local: persistReducer(
      {
        key: 'local',
        version: 1,
        storage: localStorage,
      },
      slice.reducer,
    ),
  },
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

export interface StoreState {
  theme: PaletteMode;
}

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
