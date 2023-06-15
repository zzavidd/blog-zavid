import type { HtmlToTextOptions } from 'html-to-text';
import nodemailer from 'nodemailer';
import type SMTPPool from 'nodemailer/lib/smtp-pool';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production';

/** The common HTML-to-text options for all emails. */
export const HTML_TO_TEXT_OPTIONS: HtmlToTextOptions = {
  preserveNewlines: true,
  selectors: [
    {
      selector: 'a',
      options: { linkBrackets: false, hideLinkHrefIfSameAsText: true },
    },
    { selector: 'img', format: 'skip' },
    { selector: 'h1', options: { uppercase: false } },
    { selector: 'table', options: { uppercaseHeaderCells: false } },
  ],
  wordwrap: 80,
};

const sharedTransportOptions: Partial<SMTPPool.Options> = {
  pool: true,
  maxConnections: 20,
  maxMessages: Infinity,
  dkim: {
    domainName: isProduction ? 'zavidegbue.com' : 'dev.zavidegbue.com',
    keySelector: 'default',
    privateKey: process.env.DKIM_KEY!,
  },
};

export const prodTransportOptions: SMTPTransport.Options = {
  host: process.env['EMAIL_HOST'],
  port: Number(process.env['EMAIL_PORT']),
  auth: {
    user: process.env['EMAIL_USER'],
    pass: process.env['EMAIL_PWD'],
  },
  ...sharedTransportOptions,
};

const devTransportOptions: SMTPTransport.Options = {
  host: process.env['ETHEREAL_HOST'],
  port: Number(process.env['ETHEREAL_PORT']),
  auth: {
    user: process.env['ETHEREAL_EMAIL'],
    pass: process.env['ETHEREAL_PWD'],
  },
  ...sharedTransportOptions,
};

const transportOptions = isProduction
  ? prodTransportOptions
  : devTransportOptions;

/** Initialise the mail transporter */
export const TRANSPORTER = nodemailer.createTransport({
  ...transportOptions,
  ...sharedTransportOptions,
});
