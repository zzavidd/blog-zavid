import type { HtmlToTextOptions } from 'html-to-text';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

import Settings from 'utils/settings';

export const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production';

/** A map of variables used in all EJS emails */
export const ejsLocals = {
  accounts: Settings.ACCOUNTS,
  cloudinaryBaseUrl: Settings.CLOUDINARY_BASE_URL,
  copyright: Settings.COPYRIGHT,
  domain: Settings.DOMAIN,
};

/** The common HTML-to-text options for all emails. */
export const HTML_TO_TEXT_OPTIONS: HtmlToTextOptions = {
  hideLinkHrefIfSameAsText: true,
  ignoreImage: true,
  noLinkBrackets: true,
  preserveNewlines: true,
  uppercaseHeadings: false,
  wordwrap: 80,
};

const transportOptions: SMTPTransport.Options = isProd
  ? {
      host: process.env['EMAIL_HOST'],
      port: Number(process.env['EMAIL_PORT']),
      auth: {
        user: process.env['EMAIL_USER'],
        pass: process.env['EMAIL_PWD'],
      },
    }
  : {
      host: process.env['ETHEREAL_HOST'],
      port: Number(process.env['ETHEREAL_PORT']),
      auth: {
        user: process.env['ETHEREAL_EMAIL'],
        pass: process.env['ETHEREAL_PWD'],
      },
    };

/** Initialise the mail transporter */
export const TRANSPORTER = nodemailer.createTransport({
  ...transportOptions,
  pool: true,
  maxConnections: 20,
  maxMessages: Infinity,
  dkim: {
    domainName: isProd ? 'zavidegbue.com' : 'dev.zavidegbue.com',
    keySelector: 'default',
    privateKey: process.env.DKIM_KEY!,
  },
});
