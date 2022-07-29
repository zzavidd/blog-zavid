import async from 'async';
import ejs from 'ejs';
import htmlToText from 'html-to-text';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import ReactDOMServer from 'react-dom/server';
import { v4 as uuidv4 } from 'uuid';
import { zDate, zText } from 'zavid-modules';

import type {
  DiaryDAO,
  GenericDAO,
  PostDAO,
  PostType,
  SubscriberDAO,
} from '../../../../classes';
import { SubscriberQueryBuilder, SubscriberStatic } from '../../../../classes';
import { debug } from '../../../private/error';
import {
  accounts,
  cloudinaryBaseUrl,
  copyright,
  domain,
} from '../../../settings';
import { getKnex } from '../../singleton';

const knex = getKnex();

const isDev = process.env.NODE_ENV !== 'production';

/** A map of variables used in all EJS emails */
const ejsLocals = {
  accounts,
  cloudinaryBaseUrl,
  copyright,
  domain,
};

/** The common HTML-to-text options for all emails. */
const htmlToTextOptions = {
  hideLinkHrefIfSameAsText: true,
  ignoreImage: true,
  noLinkBrackets: true,
  preserveNewlines: true,
  uppercaseHeadings: false,
  wordwrap: 80,
};

/** The email address of the recipient in development. */
const testRecipient: TestRecipient = {
  email: process.env.ETHEREAL_EMAIL!,
  token: uuidv4(),
};

/** Initialise the mail transporter */
const transporter = nodemailer.createTransport({
  host: process.env[isDev ? 'ETHEREAL_HOST' : 'EMAIL_HOST'],
  port: parseInt(process.env[isDev ? 'ETHEREAL_PORT' : 'EMAIL_PORT'] as string),
  auth: {
    user: process.env[isDev ? 'ETHEREAL_EMAIL' : 'EMAIL_USER'],
    pass: process.env[isDev ? 'ETHEREAL_PWD' : 'EMAIL_PWD'],
  },
} as SMTPTransport.Options);

const typeToSubscription: SubscriptionType = {
  Reverie: 'Reveries',
};

/**
 * Send an email to all subscribers of new post.
 * @param post The subject post for the email.
 */
export const notifyNewPost = (post: PostDAO) => {
  const { title, type, typeId, content, datePublished, image, slug } = post;
  const subject = `New ${type} (#${typeId}) "${title}"`;

  const entity = {
    post: Object.assign({}, post, {
      content: zText.truncateText(content!),
      slug: `${domain}/reveries/${slug}`,
      datePublished: zDate.formatDate(datePublished!, { withWeekday: true }),
      image: `${cloudinaryBaseUrl}/w_768,c_lfill/${image}`,
    }),
  };

  return prepareEmail(entity, typeToSubscription[type!]!, 'post', subject);
};

/**
 * Send an email to all subscribers of new diary entry.
 * @param diaryEntry The subject diary entry for the email.
 */
export const notifyNewDiaryEntry = (diaryEntry: DiaryDAO): Promise<void> => {
  const { title, date, content, footnote, slug, entryNumber } = diaryEntry;
  const subject = `Diary Entry #${entryNumber}: ${title}`;

  const options = {
    css: {
      hyperlink: 'hyperlink-content',
      blockquote: 'blockquote',
      ['twitter-button']: 'button',
      ['instagram-button']: 'button',
    },
  };

  const format = (text: string) => {
    return ReactDOMServer.renderToStaticMarkup(zText.formatText(text, options));
  };

  const entity = {
    diaryEntry: Object.assign({}, diaryEntry, {
      content: format(content!),
      footnote: format(footnote!),
      slug: `${domain}/diary/${slug}`,
      date: zDate.formatDate(date!, { withWeekday: true }),
    }),
  };

  return prepareEmail<DiaryDAO>(
    entity,
    SubscriberStatic.SUBSCRIPTIONS.Diary,
    'diary',
    subject,
  );
};

/**
 * Prepare and process email content.
 * @param entity The entity details to include in template.
 * @param type The subscription type expected of subscribers.
 * @param template The name of the template EJS file.
 * @param subject The subject of the email.
 */
const prepareEmail = async <T extends GenericDAO>(
  entity: Record<string, T>,
  type: string,
  template: string,
  subject: string,
): Promise<void> => {
  let mailList: SubscriberDAO[];

  try {
    const subscribers = await new SubscriberQueryBuilder(knex).build();

    // Retrieve list of subscribers to corresponding type
    mailList = isDev
      ? [testRecipient]
      : subscribers.filter((subscriber) => {
          const subscriptions = JSON.parse(subscriber.subscriptions as string);
          const isSubscribed = subscriptions[type];
          return isSubscribed;
        });
  } catch (err) {
    debug(err as Error);
  }

  return new Promise((resolve, reject) => {
    // Send email to shortlisted subscribers on mailing list
    async.each(
      mailList,
      function (recipient: SubscriberDAO, callback: Callback) {
        ejs.renderFile(
          __dirname + `/templates/${template}.ejs`,
          {
            ...entity,
            subscriber: recipient,
            ...ejsLocals,
          },
          {},
          function (err, message) {
            if (err) return callback(err);
            sendMailToSubscriber(recipient.email!, subject, message, callback);
          },
        );
      },
      function (err) {
        if (err) return reject(err);
        console.info(
          `Emails: "${subject}" email sent to ${mailList.length} subscribers.`,
        );
        resolve();
      },
    );
  });
};

/**
 * Send the email to a subscriber.
 * @param recipient The email address of the recipient.
 * @param subject The subject of the email.
 * @param message The content of the message.
 * @param callback The callback function.
 */
const sendMailToSubscriber = (
  recipient: string,
  subject: string,
  message: string,
  callback: Callback,
): void => {
  transporter.sendMail(
    {
      from: `ZAVID <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject,
      html: message,
      text: htmlToText.fromString(message, htmlToTextOptions),
    },
    function (err, info) {
      if (err) return callback(err);
      console.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      callback(null);
    },
  );
};

type TestRecipient = {
  email: string;
  token: string;
};
type SubscriptionType = { [key in PostType]?: string };
type Callback = (pass: null | Error) => void;
