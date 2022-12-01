import htmlToText from 'html-to-text';
import type { SentMessageInfo } from 'nodemailer';
import nodemailer from 'nodemailer';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import * as UUID from 'uuid';

import { SubscriberQueryBuilder } from 'classes/subscribers/SubscriberQueryBuilder';
import { ISubscriptionType } from 'constants/enums';
import { knex } from 'constants/knex';
import Logger from 'constants/logger';

import { HTML_TO_TEXT_OPTIONS, isProd, TRANSPORTER } from './constants';
import DiaryEmail from './templatesv2/diary';
import WishlistEmail from './templatesv2/wishlist';

/** The email address of the recipient in development. */
const testRecipient: TestRecipient = {
  email: process.env.ETHEREAL_EMAIL!,
  token: UUID.v4(),
};

const sheet = new ServerStyleSheet();

namespace Emailer {
  // /**
  //  * Send an email to all subscribers of new post.
  //  * @param post The subject post for the email.
  //  */
  // export async function notifyNewPost(post: PostDAO): Promise<void> {
  // const { title, type, typeId, content, datePublished, image, slug } = post;
  // const subject = `New ${type} (#${typeId}) "${title}"`;
  // const entity = {
  //   post: {
  //     ...post,
  //     content: ZText.truncateText(content!),
  //     slug: `${Settings.DOMAIN}/reveries/${slug}`,
  //     datePublished: ZDate.format(datePublished!),
  //     image: `${Settings.CLOUDINARY_BASE_URL}/w_768,c_lfill/${image}`,
  //   },
  // };
  // await prepareEmail(entity, SUBSCRIPTION_TYPES[type!]!, 'post', subject);
  // }

  /**
   * Send an email to all subscribers of new diary entry.
   * @param diaryEntry The subject diary entry for the email.
   */
  export function notifyNewDiaryEntry(diaryEntry: DiaryDAO): Promise<void> {
    const subject = `Diary Entry #${diaryEntry.entryNumber}: ${diaryEntry.title}`;
    return prepareEmail(
      DiaryEmail,
      { diaryEntry },
      subject,
      ISubscriptionType.Diary,
    );
  }

  /**
   * Send an email to the claimant of the wishlist item.
   * @param wishlistItem The wishlist item being claimed.
   * @param claimant The email address of the claimant.
   */
  export async function notifyWishlistItemClaimant(
    wishlistItem: WishlistDAO,
    claimant: string,
  ): Promise<void> {
    const subject = "You claimed an item on Zavid's Wishlist.";
    const element = React.createElement(WishlistEmail, { wishlistItem });
    const message = ReactDOMServer.renderToStaticMarkup(element);
    await sendMailToAddress(claimant, subject, message);
  }
}

export default Emailer;

/**
 * Prepare and process email content.
 * @param template The template element.
 * @param props The template props.
 * @param subject The subject of the email.
 * @param type The subscription type expected of subscribers.
 */
async function prepareEmail<T extends Record<string, unknown>>(
  template: React.FunctionComponent<any>,
  props: T,
  subject: string,
  type: SubscriptionType,
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

    const promises = mailList.map((recipient) => {
      const element = React.createElement(template, {
        ...props,
        token: recipient.token,
      });
      const message = ReactDOMServer.renderToStaticMarkup(
        sheet.collectStyles(element),
      );
      return sendMailToAddress(recipient.email, subject, message);
    });
    await Promise.all(promises);

    Logger.info(
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
async function sendMailToAddress(
  recipient: string,
  subject: string,
  message: string,
): Promise<void> {
  const info = await TRANSPORTER.sendMail({
    from: `ZAVID <${process.env.EMAIL_USER}>`,
    to: recipient,
    subject,
    html: message,
    text: htmlToText.fromString(message, HTML_TO_TEXT_OPTIONS),
  });
  console.info(
    `Preview URL: ${nodemailer.getTestMessageUrl(info as SentMessageInfo)}`,
  );
}

interface TestRecipient {
  email: string;
  token: string;
}
