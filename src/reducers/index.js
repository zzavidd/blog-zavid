import { combineReducers } from 'redux';

const defaultTheme = 'light';

const themeReducer = (state = defaultTheme, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return action.payload;
    case 'TOGGLE_THEME':
      return state === 'light' ? 'dark' : 'light';
    default:
      return state;
  }
};

export default combineReducers({
  theme: themeReducer
});
