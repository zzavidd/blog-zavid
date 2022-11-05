import { combineReducers, configureStore, createSlice } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import type { PersistPartial } from 'redux-persist/lib/persistReducer';
import localStorage from 'redux-persist/lib/storage';
import sessionStorage from 'redux-persist/lib/storage/session';

import { AppTheme } from 'classes/theme';
import type WishlistDAO from 'classes/wishlist/WishlistDAO';

import Reducers from './functions';

const initialLocalState: AppLocalState = {
  appTheme: AppTheme.DARK,
  cookiePolicyAccepted: false,
  savedText: '',
  wishlist: {
    sortProperty: 'createTime',
    sortOrderAscending: false,
  },
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

export namespace AppActions {
  export const {
    setAppTheme,
    setCookiePolicyAccepted,
    setWishlistSort,
    saveInputText,
  } = localSlice.actions;
  export const { setLoginSnackShown } = sessionSlice.actions;
}

export interface AppLocalState {
  appTheme: AppTheme;
  cookiePolicyAccepted: boolean;
  savedText: string;
  wishlist: {
    sortProperty: keyof WishlistDAO;
    sortOrderAscending: boolean;
  };
}

export interface AppSessionState {
  loginSnackShown: boolean;
}

export type AppState = ReturnType<typeof store.getState>;
