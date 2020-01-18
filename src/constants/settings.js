const dev = process.env.NODE_ENV !== 'production';

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
     * Initalises the body theme.
     * Defaults to LIGHT if theme neither light or dark.
     * @param {string} store - The Redux store containing the theme.
     */
    initialise: (store, setTheme) => {
      let { theme: currentTheme } = store.getState();
      if (currentTheme !== 'light' && currentTheme !== 'dark'){
        currentTheme = 'light';
      }

      const oppositeTheme = currentTheme === 'light' ? 'dark' : 'light';

      document.body.classList.remove(`body-${oppositeTheme}`);
      document.body.classList.add(`body-${currentTheme}`);

      store.dispatch(setTheme(currentTheme));
    },

    switch: (currentTheme, setTheme) => {
      const oppositeTheme = currentTheme === 'light' ? 'dark' : 'light';

      document.body.classList.remove(`body-${currentTheme}`);
      document.body.classList.add(`body-${oppositeTheme}`);

      setTheme(oppositeTheme);
    },
  },

  /** The website title */
  title: 'Z A V I D'
};
