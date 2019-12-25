/** Set theme */
export const setTheme = theme => ({
  type: 'SET_THEME',
  payload: theme
});

/** Toggle between light and dark themes */
export const toggleTheme = () => ({
  type: 'TOGGLE_THEME'
});