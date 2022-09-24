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

export interface AppState {
  appTheme: AppTheme;
  savedText: string;
}

const initialState: AppState = {
  appTheme: AppTheme.LIGHT,
  savedText: '',
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
  export const { saveInputText, setAppTheme } = slice.actions;
}

export type AppDispatch = typeof store.dispatch;
