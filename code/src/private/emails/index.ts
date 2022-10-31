import ejs from 'ejs';
import htmlToText from 'html-to-text';
import getConfig from 'next/config';
import type { SentMessageInfo } from 'nodemailer';
import nodemailer from 'nodemailer';
import ReactDOMServer from 'react-dom/server';
import * as UUID from 'uuid';

const { serverRuntimeConfig } = getConfig();

import type { DiaryDAO } from 'classes/diary/DiaryDAO';
import type { PostDAO } from 'classes/posts/PostDAO';
import type { SubscriberDAO } from 'classes/subscribers/SubscriberDAO';
import { SubscriberQueryBuilder } from 'classes/subscribers/SubscriberQueryBuilder';
import { SubscriberStatic } from 'classes/subscribers/SubscriberStatic';
import { knex } from 'constants/knex';
import Settings from 'constants/settings';
import ZDate from 'lib/date';
import * as ZText from 'lib/text';

import {
  ejsLocals,
  htmlToTextOptions,
  isProd,
  transporter,
  typeToSubscription,
} from './constants';

/** The email address of the recipient in development. */
const testRecipient: TestRecipient = {
  email: process.env.ETHEREAL_EMAIL!,
  token: UUID.v4(),
};

namespace Emailer {
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
        content: ZText.truncateText(content!),
        slug: `${Settings.DOMAIN}/reveries/${slug}`,
        datePublished: ZDate.format(datePublished!),
        image: `${Settings.CLOUDINARY_BASE_URL}/w_768,c_lfill/${image}`,
      },
    };

    await prepareEmail(entity, typeToSubscription[type!]!, 'post', subject);
  }

  /**
   * Send an email to all subscribers of new diary entry.
   * @param diaryEntry The subject diary entry for the email.
   */
  export function notifyNewDiaryEntry(diaryEntry: DiaryDAO): Promise<void> {
    const { title, date, content, footnote, entryNumber } = diaryEntry;
    const subject = `Diary Entry #${entryNumber}: ${title}`;

    // const options = {
    //   css: {
    //     hyperlink: 'hyperlink-content',
    //     blockquote: 'blockquote',
    //     ['twitter-button']: 'button',
    //     ['instagram-button']: 'button',
    //   },
    // };

    function format(text: string): string {
      // TODO: Correct email text styling
      const formattedText = ZText.formatText(text);
      return ReactDOMServer.renderToStaticMarkup(formattedText);
    }

    const entity = {
      diaryEntry: {
        ...diaryEntry,
        content: format(content!),
        footnote: format(footnote!),
        slug: `${Settings.DOMAIN}/diary/${entryNumber}`,
        date: ZDate.format(date!),
      },
    };

    return prepareEmail<DiaryDAO>(
      entity,
      SubscriberStatic.SUBSCRIPTIONS.Diary,
      'diary',
      subject,
    );
  }
}

export default Emailer;

/**
 * Prepare and process email content.
 * @param entity The entity details to include in template.
 * @param type The subscription type expected of subscribers.
 * @param template The name of the template EJS file.
 * @param subject The subject of the email.
 */
async function prepareEmail<T>(
  entity: Record<string, T>,
  type: string,
  template: string,
  subject: string,
): Promise<void> {
  let mailList: SubscriberDAO[] | [TestRecipient];

  try {
    const subscribers = await new SubscriberQueryBuilder(knex).build();

    // Retrieve list of subscribers to corresponding type
    mailList = isProd
      ? subscribers.filter((subscriber) => {
          const subscriptions = JSON.parse(subscriber.subscriptions as string);
          const isSubscribed = subscriptions[type];
          return isSubscribed;
        })
      : [testRecipient];

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
  console.info(
    `Preview URL: ${nodemailer.getTestMessageUrl(info as SentMessageInfo)}`,
  );
}

interface TestRecipient {
  email: string;
  token: string;
}
