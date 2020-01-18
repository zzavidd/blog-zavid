const dev = process.env.NODE_ENV !== 'production';
import { setTheme } from '~/reducers/actions';

module.exports = {
  /** The full URLs for each #WOKEWeekly account */
  accounts: {
    facebook: 'https://www.facebook.com/zzavidd',
    twitter: 'https://www.twitter.com/zzavidd',
    instagram: 'https://www.instagram.com/zavidd',
    linkedin: 'https://www.linkedin.com/in/david-egbue'
  },

  /** Cloudinary */
  cloudinary: {
    url: 'https://res.cloudinary.com/zavid/image/upload'
  },

  /** Domain to use dependent on environment */
  domain: dev ? 'http://localhost:3000' : 'https://www.zavidegbue.com',

  /** My email address */
  email: 'zavidegbue@gmail.com',

  theme: {
    /**
     * Switches theme and sets the body theme.
     * Defaults to LIGHT if theme neither light or dark.
     * @param {string} store - The Redux store containing the theme.
     */
    switch: store => {
      let { theme: currentTheme } = store.getState();
      if (currentTheme !== 'light' && currentTheme !== 'dark')
        currentTheme = 'light';

      const isLight = currentTheme === 'light';
      const oppositeTheme = isLight ? 'dark' : 'light';

      document.body.classList.remove(`body-${oppositeTheme}`);
      document.body.classList.add(`body-${currentTheme}`);

      store.dispatch(setTheme(currentTheme));
    }
  },

  /** The website title */
  title: 'Z A V I D'
};
