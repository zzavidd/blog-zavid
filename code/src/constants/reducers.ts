import type { PayloadAction } from '@reduxjs/toolkit';
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

const initialLocalState: AppLocalState = {
  appTheme: AppTheme.LIGHT,
  savedText: '',
};

const initialSessionState: AppSessionState = {
  loginSnackShown: false,
};

const localSlice = createSlice({
  name: 'local',
  initialState: initialLocalState,
  reducers: {
    saveInputText: (state, action: PayloadAction<string>) => {
      state.savedText = action.payload;
    },
    setAppTheme: (state, action: PayloadAction<AppTheme>) => {
      state.appTheme = action.payload;
    },
  },
});

const sessionSlice = createSlice({
  name: 'session',
  initialState: initialSessionState,
  reducers: {
    setLoginSnackShown: (state, action: PayloadAction<boolean>) => {
      state.loginSnackShown = action.payload;
    },
  },
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
  export const { saveInputText, setAppTheme } = localSlice.actions;
  export const { setLoginSnackShown } = sessionSlice.actions;
}

export interface AppLocalState {
  appTheme: AppTheme;
  savedText: string;
}

export interface AppSessionState {
  loginSnackShown: boolean;
}

export type AppState = ReturnType<typeof store.getState>;
