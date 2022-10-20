import getConfig from 'next/config';
import nodemailer from 'nodemailer';

const { serverRuntimeConfig } = getConfig();

import type { PostType } from 'classes/posts/PostDAO';
import Settings from 'constants/settings';

export const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production';

/** A map of variables used in all EJS emails */
export const ejsLocals = {
  accounts: Settings.ACCOUNTS,
  cloudinaryBaseUrl: Settings.CLOUDINARY_BASE_URL,
  copyright: Settings.COPYRIGHT,
  domain: Settings.DOMAIN,
};

/** The common HTML-to-text options for all emails. */
export const htmlToTextOptions = {
  hideLinkHrefIfSameAsText: true,
  ignoreImage: true,
  noLinkBrackets: true,
  preserveNewlines: true,
  uppercaseHeadings: false,
  wordwrap: 80,
};

/** Initialise the mail transporter */
export const transporter = nodemailer.createTransport({
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

export const typeToSubscription: SubscriptionType = {
  Reverie: 'Reveries',
};

type SubscriptionType = { [key in PostType]?: string };
