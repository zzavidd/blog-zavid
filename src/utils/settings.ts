namespace Settings {
  /** The full URLs for each of my social media accounts. */
  export const ACCOUNTS = {
    // facebook: 'https://www.facebook.com/zzavidd',
    twitter: 'https://www.twitter.com/zzavidd',
    instagram: 'https://www.instagram.com/zavidd',
    linkedin: 'https://www.linkedin.com/in/david-egbue',
    snapchat: 'https://www.snapchat.com/add/zzavidd',
  } as const;

  /** The date this blog was founded. Month is 0-indexed. */
  export const BLOG_CREATION_DATE = new Date(2017, 8, 2);

  /** The date this blog was redeveloped. Month is 0-indexed. */
  export const BLOG_REDEVELOPMENT_DATE = new Date(2020, 8, 21);

  /** The default card image to use for SEO. */
  export const CARD_IMAGE = 'v1600638270/static/bg/card-home.jpg';

  /** The name of the site cookie for consent. */
  export const COOKIES = <const>{
    CONSENT: 'zblog.consent',
    TIP: 'zblog.longpresstip',
  };

  /** The base URL for Cloudinary media. */
  export const CLOUDINARY_BASE_URL =
    'https://res.cloudinary.com/zavid/image/upload';

  /** The copyright declaration. */
  export const COPYRIGHT = `\u00A9 ${new Date().getFullYear()} ZAVID`;

  /** Domain to use dependent on environment. */
  export const DOMAIN =
    process.env.NEXT_PUBLIC_APP_ENV === 'production'
      ? 'https://zavidegbue.com'
      : process.env.NEXT_PUBLIC_APP_ENV === 'staging'
      ? 'https://dev.zavidegbue.com'
      : 'http://localhost:4000';

  export const RESOURCE_MAP: Record<string, string> = {
    'dissertation': '/v1601812127/static/docs/dissertation.pdf',
    'university-thrival-guide':
      '/v1601812122/static/docs/university-thrival-guide.pdf',
  };

  /** The website title. */
  export const SITE_TITLE = 'ZAVID';

  export const SITE_TAGLINE = 'A Galaxy Mind in a Universe World';

  /** /the date of Zavid's birthday. Month is 0-indexed. */
  export const ZAVID_BIRTHDAY = new Date(1996, 11, 2);
}

export default Settings;
