import type { PayloadAction } from '@reduxjs/toolkit';
import { configureStore, createSlice } from '@reduxjs/toolkit';
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
import storage from 'redux-persist/lib/storage';

import { AppTheme } from 'classes/theme';

import type * as ZBT from './types';

export interface AppState {
  appTheme: AppTheme;
  savedText: string;
  snackMessages: ZBT.SnackMessage[];
}

const initialState: AppState = {
  appTheme: AppTheme.LIGHT,
  savedText: '',
  snackMessages: [],
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    saveInputText: (state, action: PayloadAction<string>) => {
      state.savedText = action.payload;
    },
    setAppTheme: (state, action: PayloadAction<AppTheme>) => {
      state.appTheme = action.payload;
    },
    setSnackMessage: (state, action: PayloadAction<ZBT.SnackMessage>) => {
      const { message, duration = 6000 } = action.payload;
      state.snackMessages.push({
        message,
        duration,
      });
    },
    clearSnackMessage: (state, action: PayloadAction<number>) => {
      const index = action?.payload;
      state.snackMessages.splice(index, 1);
    },
    clearAllSnackMessages: (state) => {
      state.snackMessages = [];
    },
  },
});

export const store = configureStore({
  reducer: persistReducer(
    {
      key: 'root',
      version: 1,
      storage,
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

export namespace AppActions {
  export const {
    clearSnackMessage,
    clearAllSnackMessages,
    saveInputText,
    setAppTheme,
    setSnackMessage,
  } = slice.actions;
}

export type AppDispatch = typeof store.dispatch;
