import type { PaletteMode } from '@mui/material';
import { combineReducers, configureStore, createSlice } from '@reduxjs/toolkit';
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
import type { PersistPartial } from 'redux-persist/lib/persistReducer';
import localStorage from 'redux-persist/lib/storage';
import sessionStorage from 'redux-persist/lib/storage/session';

import Reducers from './functions';

const initialLocalState: AppLocalState = {
  theme: 'dark',
  cookiePolicyAccepted: false,
};

const initialSessionState: AppSessionState = {
  loginSnackShown: false,
};

const localSlice = createSlice({
  name: 'local',
  initialState: initialLocalState,
  reducers: Reducers.Local,
});

const sessionSlice = createSlice({
  name: 'session',
  initialState: initialSessionState,
  reducers: Reducers.Session,
});

export const store = configureStore({
  reducer: combineReducers<{
    readonly local: AppLocalState & PersistPartial;
    readonly session: AppSessionState & PersistPartial;
  }>({
    local: persistReducer(
      {
        key: 'local',
        version: 1,
        storage: localStorage,
      },
      localSlice.reducer,
    ),
    session: persistReducer(
      {
        key: 'session',
        version: 1,
        storage: sessionStorage,
      },
      sessionSlice.reducer,
    ),
  } as const),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);

export const AppActions = { ...localSlice.actions, ...sessionSlice.actions };

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export interface AppLocalState {
  cookiePolicyAccepted: boolean;
  theme: PaletteMode;
}

export interface AppSessionState {
  loginSnackShown: boolean;
}

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
