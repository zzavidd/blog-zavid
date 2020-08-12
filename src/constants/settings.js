const dev = process.env.NODE_ENV !== 'production';

/** The full URLs for each #WOKEWeekly account */
exports.accounts = {
  facebook: 'https://www.facebook.com/zzavidd',
  twitter: 'https://www.twitter.com/zzavidd',
  instagram: 'https://www.instagram.com/zavidd',
  linkedin: 'https://www.linkedin.com/in/david-egbue'
};

exports.creationDate = new Date(2017, 9, 2);

/** Domain to use dependent on environment */
exports.domain = dev ? 'http://localhost:4000' : 'https://www.zavidegbue.com';

/** My email address */
exports.email = 'zavidegbue@gmail.com';

/** The website title */
exports.siteTitle = 'Z A V I D';
