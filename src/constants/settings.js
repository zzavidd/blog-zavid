const dev = process.env.NODE_ENV !== 'production';

module.exports = {

  /** The full URLs for each #WOKEWeekly account */
  accounts: {
    facebook: "https://www.facebook.com/zzavidd",
    twitter: "https://www.twitter.com/zzavidd",
    instagram: "https://www.instagram.com/zavidd",
    linkedin: "https://www.linkedin.com/in/david-egbue",
  },

  /** Domain to use dependent on environment */
  domain: dev ? 'http://localhost:3000' : "https://www.zavidegbue.com",

  /** My email address */
  email: "zavidegbue@gmail.com",
}