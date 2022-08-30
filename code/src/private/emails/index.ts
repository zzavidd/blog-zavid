import ejs from 'ejs';
import htmlToText from 'html-to-text';
import getConfig from 'next/config';
import nodemailer from 'nodemailer';
import ReactDOMServer from 'react-dom/server';
import { v4 as uuidv4 } from 'uuid';
import { zDate, zText } from 'zavid-modules';

const { serverRuntimeConfig } = getConfig();

import type {
  DiaryDAO,
  GenericDAO,
  PostDAO,
  PostType,
  SubscriberDAO,
} from 'classes';
import { SubscriberQueryBuilder, SubscriberStatic } from 'classes';
import { knex } from 'constants/knex';
import {
  ACCOUNTS,
  CLOUDINARY_BASE_URL,
  COPYRIGHT,
  DOMAIN,
} from 'constants/settings';

const isDev = process.env.NODE_ENV !== 'production';

/** A map of variables used in all EJS emails */
const ejsLocals = {
  accounts: ACCOUNTS,
  cloudinaryBaseUrl: CLOUDINARY_BASE_URL,
  copyright: COPYRIGHT,
  domain: DOMAIN,
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
});

const typeToSubscription: SubscriptionType = {
  Reverie: 'Reveries',
};

/**
 * Send an email to all subscribers of new post.
 * @param post The subject post for the email.
 */
export async function notifyNewPost(post: PostDAO): Promise<void> {
  const { title, type, typeId, content, datePublished, image, slug } = post;
  const subject = `New ${type} (#${typeId}) "${title}"`;

  const entity = {
    post: {
      ...post,
      content: zText.truncateText(content!),
      slug: `${DOMAIN}/reveries/${slug}`,
      datePublished: zDate.formatDate(datePublished!, { withWeekday: true }),
      image: `${CLOUDINARY_BASE_URL}/w_768,c_lfill/${image}`,
    },
  };

  await prepareEmail(entity, typeToSubscription[type!]!, 'post', subject);
}

/**
 * Send an email to all subscribers of new diary entry.
 * @param diaryEntry The subject diary entry for the email.
 */
export function notifyNewDiaryEntry(diaryEntry: DiaryDAO): Promise<void> {
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

  function format(text: string): string {
    const formattedText = zText.formatText(text, options);
    return ReactDOMServer.renderToStaticMarkup(formattedText);
  }

  const entity = {
    diaryEntry: Object.assign({}, diaryEntry, {
      content: format(content!),
      footnote: format(footnote!),
      slug: `${DOMAIN}/diary/${slug}`,
      date: zDate.formatDate(date!, { withWeekday: true }),
    }),
  };

  return prepareEmail<DiaryDAO>(
    entity,
    SubscriberStatic.SUBSCRIPTIONS.Diary,
    'diary',
    subject,
  );
}

/**
 * Prepare and process email content.
 * @param entity The entity details to include in template.
 * @param type The subscription type expected of subscribers.
 * @param template The name of the template EJS file.
 * @param subject The subject of the email.
 */
async function prepareEmail<T extends GenericDAO>(
  entity: Record<string, T>,
  type: string,
  template: string,
  subject: string,
): Promise<void> {
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

    const promises = mailList.map(async (recipient) => {
      const message = await ejs.renderFile(
        `${serverRuntimeConfig.templatesDir}/${template}.ejs`,
        {
          ...entity,
          subscriber: recipient,
          ...ejsLocals,
        },
      );
      await sendMailToSubscriber(recipient.email!, subject, message);
    });

    await Promise.all(promises);
    console.info(
      `Emails: "${subject}" email sent to ${mailList.length} subscribers.`,
    );
  } catch (err: any) {
    throw new Error(err);
  }
}

/**
 * Send the email to a subscriber.
 * @param recipient The email address of the recipient.
 * @param subject The subject of the email.
 * @param message The content of the message.
 */
async function sendMailToSubscriber(
  recipient: string,
  subject: string,
  message: string,
): Promise<void> {
  const info = await transporter.sendMail({
    from: `ZAVID <${process.env.EMAIL_USER}>`,
    to: recipient,
    subject,
    html: message,
    text: htmlToText.fromString(message, htmlToTextOptions),
  });
  console.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
}

interface TestRecipient {
  email: string;
  token: string;
}
type SubscriptionType = { [key in PostType]?: string };
