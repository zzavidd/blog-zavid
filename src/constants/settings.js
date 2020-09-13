const dev = process.env.NODE_ENV !== 'production';

/** The full URLs for each my social media accounts. */
exports.accounts = {
  // facebook: 'https://www.facebook.com/zzavidd',
  twitter: 'https://www.twitter.com/zzavidd',
  instagram: 'https://www.instagram.com/zavidd',
  linkedin: 'https://www.linkedin.com/in/david-egbue',
  snapchat: 'https://www.snapchat.com/add/zzavidd'
};

/** The base URL for Cloudinary media. */
exports.cloudinaryBaseUrl = 'https://res.cloudinary.com/zavid/image/upload';

/** The copyright declaration. */
exports.copyright = `\u00A9 ${new Date().getFullYear()} ZAVID`;

/** The date this blog was founded. Month is 0-indexed. */
exports.creationDate = new Date(2017, 8, 2);

/** The date this blog was redeveloped. Month is 0-indexed. */
// TODO: To change on launch
exports.redevelopmentDate = new Date(2020, 8, 2);

/** Domain to use dependent on environment. */
exports.domain = dev ? 'http://localhost:4000' : 'https://www.zavidegbue.com';

/** The website title. */
exports.siteTitle = 'Z A V I D';

/** /the date of Zavid's birthday. Month is 0-indexed. */
exports.zavidBirthday = new Date(1996, 11, 2);
