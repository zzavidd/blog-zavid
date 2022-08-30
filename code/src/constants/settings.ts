/** The full URLs for each of my social media accounts. */
export const ACCOUNTS = {
  // facebook: 'https://www.facebook.com/zzavidd',
  twitter: 'https://www.twitter.com/zzavidd',
  instagram: 'https://www.instagram.com/zavidd',
  linkedin: 'https://www.linkedin.com/in/david-egbue',
  snapchat: 'https://www.snapchat.com/add/zzavidd',
};

/** The date this blog was founded. Month is 0-indexed. */
export const BLOG_CREATION_DATE = new Date(2017, 8, 2);

/** The date this blog was redeveloped. Month is 0-indexed. */
export const BLOG_REDEVELOPMENT_DATE = new Date(2020, 8, 21);

/** The base URL for Cloudinary media. */
export const CLOUDINARY_BASE_URL =
  'https://res.cloudinary.com/zavid/image/upload';

/** The copyright declaration. */
export const COPYRIGHT = `\u00A9 ${new Date().getFullYear()} ZAVID`;

export const EMAILS_ON =
  process.env.NODE_ENV === 'production' || process.env.EMAILS_ON === 'true';

/** Domain to use dependent on environment. */
export const DOMAIN =
  process.env.NODE_ENV === 'production'
    ? 'https://zavidegbue.com'
    : process.env.NODE_ENV === ('staging' as 'test')
    ? 'https://dev.zavidegbue.com'
    : 'http://localhost:4000';

export const RESOURCE_MAP: Record<string, string> = {
  'dissertation': '/v1601812127/static/docs/dissertation.pdf',
  'university-thrival-guide':
    '/v1601812122/static/docs/university-thrival-guide.pdf',
};

/** The website title. */
export const SITE_TITLE = 'ZAVID';

/** /the date of Zavid's birthday. Month is 0-indexed. */
export const ZAVID_BIRTHDAY = new Date(1996, 11, 2);
