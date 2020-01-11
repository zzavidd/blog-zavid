const dev = process.env.NODE_ENV !== 'production';

module.exports = {

  /** The full URLs for each #WOKEWeekly account */
  accounts: {
    facebook: "https://www.facebook.com/zzavidd",
    twitter: "https://www.twitter.com/zzavidd",
    instagram: "https://www.instagram.com/zavidd",
    linkedin: "https://www.linkedin.com/in/david-egbue",
  },

  /** Cloudinary */
  cloudinary: {
    url: 'https://res.cloudinary.com/zavid/image/upload'
  },

  /** Domain to use dependent on environment */
  domain: dev ? 'http://localhost:3000' : "https://www.zavidegbue.com",

  /** My email address */
  email: "zavidegbue@gmail.com",

  theme: {
    /**
     * Switches theme and sets the body theme.
     * @param {string} xTheme - The current set theme.
     */
    switch: (xTheme) => {
      if (xTheme !== 'light' && xTheme !== 'dark') xTheme = 'light';
      const isLight = xTheme === 'light';
      const yTheme = isLight ? 'dark' : 'light';
      document.body.classList.remove(`body-${yTheme}`);
      document.body.classList.add(`body-${xTheme}`);
    }
  },

  /** The website title */
  title: "Z A V I D"
}