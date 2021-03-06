import { AnyAction, combineReducers, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { PostStatus, PostType, ThemeOption } from 'classes';

/**
 * ACTIONS.
 */

export const setTheme = (theme: ThemeOption): AnyAction => ({
  type: 'SET_THEME',
  payload: theme
});

export const updatePostFilterSettings = (
  settings: PostFiltersState
): AnyAction => ({
  type: 'UPDATE_POST_FILTER_SETTINGS',
  payload: settings
});

export const setUser = (user: UserState): AnyAction => ({
  type: 'SET_USER',
  payload: user
});

export const clearUser = (): AnyAction => ({
  type: 'CLEAR_USER'
});

export const saveText = (text: string): AnyAction => ({
  type: 'SAVE_TEXT',
  payload: text
});

/**
 * REDUCERS.
 */

const themeReducer = (
  state = ThemeOption.DARK,
  { type, payload }: AnyAction
): string => {
  switch (type) {
    case 'SET_THEME':
      return payload || state;
    default:
      return state;
  }
};

const postReducer = (
  state: PostFiltersState = {
    limit: 20,
    field: 'id',
    order: 'DESC',
    type: null
  },
  { type, payload }: AnyAction
): PostFiltersState => {
  switch (type) {
    case 'UPDATE_POST_FILTER_SETTINGS':
      return Object.assign({}, state, payload);
    default:
      return state;
  }
};

const userReducer = (
  state = { isAuthenticated: false },
  { type, payload }: AnyAction
): UserState => {
  switch (type) {
    case 'SET_USER':
      return payload || state;
    case 'CLEAR_USER':
    default:
      return state;
  }
};

const textReducer = (state = '', { type, payload }: AnyAction): string => {
  switch (type) {
    case 'SAVE_TEXT':
      return payload || state;
    default:
      return state;
  }
};

/**
 * STORE.
 */

const config = {
  key: 'root',
  storage: storage
};

const persistedReducer = persistReducer(
  config,
  combineReducers({
    theme: themeReducer,
    postFilterOptions: postReducer,
    user: userReducer,
    savedText: textReducer
  })
);

export default () => {
  const store = createStore(persistedReducer);
  const persistor = persistStore(store);
  return { store, persistor };
};

export interface PostFiltersState {
  limit?: number;
  field?: string;
  order?: string;
  type?: PostType | null;
  status?: PostStatus;
}

interface UserState {
  isAuthenticated: boolean;
}
