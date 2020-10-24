import { combineReducers, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

/**
 * ACTIONS.
 */

export const setTheme = (theme) => ({
  type: 'SET_THEME',
  payload: theme
});

export const updatePostFilterSettings = (settings) => ({
  type: 'UPDATE_POST_FILTER_SETTINGS',
  payload: settings
});

export const setUser = (user) => ({
  type: 'SET_USER',
  payload: user
});

export const clearUser = () => ({
  type: 'CLEAR_USER'
});

export const saveText = (text) => ({
  type: 'SAVE_TEXT',
  payload: text
});

/**
 * REDUCERS.
 */

const themeReducer = (state = 'light', { type, payload }) => {
  switch (type) {
    case 'SET_THEME':
      return payload || state;
    default:
      return state;
  }
};

const postReducer = (
  state = { limit: 20, field: 'id', order: 'DESC', type: null },
  { type, payload }
) => {
  switch (type) {
    case 'UPDATE_POST_FILTER_SETTINGS':
      return Object.assign({}, state, payload);
    default:
      return state;
  }
};

const userReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case 'SET_USER':
      return payload || state;
    case 'CLEAR_USER':
      return {};
    default:
      return state;
  }
};

const textReducer = (state = '', { type, payload }) => {
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
  let store = createStore(persistedReducer);
  let persistor = persistStore(store);
  return { store, persistor };
};
