import { combineReducers } from 'redux';

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

export default combineReducers({
  theme: themeReducer,
  postFilterOptions: postReducer
});
