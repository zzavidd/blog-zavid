import { combineReducers } from 'redux';

const defaultTheme = {
  theme: 'light'
}

const themeReducer = (state = defaultTheme, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return action.payload;
    case 'TOGGLE_THEME':
      if (state.theme === 'light'){
        state.theme = 'dark';
      } else {
        state.theme = 'light';
      }
      return state;
    default:
      return state;
  }
}

export default combineReducers({
  theme: themeReducer
});