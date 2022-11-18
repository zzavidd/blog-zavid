import getConfig from 'next/config';
import nodemailer from 'nodemailer';

const { serverRuntimeConfig } = getConfig();

import Settings from 'constants/settings';

export const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production';

export const EmailTheme: 'Light' | 'Dark' = 'Light';

export const EmailStyle = {
  Color: {
    Light: {
      Primary: '#dfdfdf',
      Secondary: '#eeeeee',
      Body: '#f7f7f7',
      Hyperlink: 'hsl(268, 100%, 50%)',
      Button: '#383838',
      ButtonText: '#ffffff',
      Text: '#000000',
    },
    Dark: {
      Primary: '#111111',
      Secondary: '#202020',
      Body: '#080808',
      Hyperlink: 'hsl(268, 100%, 76%)',
      Button: '#383838',
      ButtonText: '#ffffff',
      Text: '#ffffff',
    },
  },
  Font: 'Mulish, "Trebuchet MS", Helvetica, sans-serif',
};

/** A map of variables used in all EJS emails */
export const ejsLocals = {
  accounts: Settings.ACCOUNTS,
  cloudinaryBaseUrl: Settings.CLOUDINARY_BASE_URL,
  copyright: Settings.COPYRIGHT,
  domain: Settings.DOMAIN,
};

/** The common HTML-to-text options for all emails. */
export const HTML_TO_TEXT_OPTIONS = {
  hideLinkHrefIfSameAsText: true,
  ignoreImage: true,
  noLinkBrackets: true,
  preserveNewlines: true,
  uppercaseHeadings: false,
  wordwrap: 80,
};

/** Initialise the mail transporter */
export const TRANSPORTER = nodemailer.createTransport({
  host: process.env[isProd ? 'EMAIL_HOST' : 'ETHEREAL_HOST'],
  port: parseInt(
    process.env[isProd ? 'EMAIL_PORT' : 'ETHEREAL_PORT'] as string,
  ),
  auth: {
    user: process.env[isProd ? 'EMAIL_USER' : 'ETHEREAL_EMAIL'],
    pass: process.env[isProd ? 'EMAIL_PWD' : 'ETHEREAL_PWD'],
  },
  pool: true,
  maxConnections: 20,
  maxMessages: Infinity,
  dkim: {
    domainName: isProd ? 'zavidegbue.com' : 'dev.zavidegbue.com',
    keySelector: 'default',
    privateKey: serverRuntimeConfig.dkimPrivateKey,
  },
});
