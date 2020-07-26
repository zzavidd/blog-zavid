const dev = process.env.NODE_ENV !== 'production';

/** The full URLs for each #WOKEWeekly account */
exports.accounts = {
  facebook: 'https://www.facebook.com/zzavidd',
  twitter: 'https://www.twitter.com/zzavidd',
  instagram: 'https://www.instagram.com/zavidd',
  linkedin: 'https://www.linkedin.com/in/david-egbue'
};

/** Cloudinary */
exports.cloudinary = {
  url: 'https://res.cloudinary.com/zavid/image/upload'
};

/** Domain to use dependent on environment */
exports.domain = dev ? 'http://localhost:3000' : 'https://www.zavidegbue.com';

/** My email address */
exports.email = 'zavidegbue@gmail.com';

/** The website title */
exports.siteTitle = 'Z A V I D';
