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

  /**
   * Abstract function for requests.
   * @param {string} image - The image in question.
   * @returns {Boolean} Value indicating whether it's from Cloudinary
   */
  request: ({url, method = 'GET', body, headers = {}, onSuccess}) => {
    headers['Content-Type'] = 'application/json';
    url = `/api${url}`;
    
    fetch(url, { method, body, headers })
    .then(res => Promise.all([res, res.json()]))
    .then(([status, response]) => { 
      if (status.ok){
        onSuccess(response);
      } else {
        console.error(response.message);
      }
    }).catch(error => {
      console.error(error);
    });
  },

  /** The website title */
  title: "Z A V I D"
}