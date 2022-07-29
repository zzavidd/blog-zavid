/** The full URLs for each my social media accounts. */
export const accounts = {
  // facebook: 'https://www.facebook.com/zzavidd',
  twitter: 'https://www.twitter.com/zzavidd',
  instagram: 'https://www.instagram.com/zavidd',
  linkedin: 'https://www.linkedin.com/in/david-egbue',
  snapchat: 'https://www.snapchat.com/add/zzavidd'
};

/** The base URL for Cloudinary media. */
export const cloudinaryBaseUrl =
  'https://res.cloudinary.com/zavid/image/upload';

/** The copyright declaration. */
export const copyright = `\u00A9 ${new Date().getFullYear()} ZAVID`;

/** The date this blog was founded. Month is 0-indexed. */
export const creationDate = new Date(2017, 8, 2);

/** The date this blog was redeveloped. Month is 0-indexed. */
export const redevelopmentDate = new Date(2020, 8, 21);

/** Domain to use dependent on environment. */
export const domain =
  process.env.NODE_ENV === 'production'
    ? 'https://zavidegbue.com'
    : process.env.NODE_ENV === 'staging' as 'test'
    ? 'https://dev.zavidegbue.com'
    : 'http://localhost:4000';

/** The website title. */
export const siteTitle = 'ZAVID';

/** /the date of Zavid's birthday. Month is 0-indexed. */
export const zavidBirthday = new Date(1996, 11, 2);
