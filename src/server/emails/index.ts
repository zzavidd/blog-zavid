import { renderToMjml } from '@faire/mjml-react/utils/renderToMjml';
import { capitalize } from '@mui/material';
import type {
  Diary,
  Exclusive,
  Post,
  Prisma,
  Subscriber,
  WishlistItem,
} from '@prisma/client';
import { convert } from 'html-to-text';
import mjml2html from 'mjml';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import React from 'react';
import { v4 as UUIDv4 } from 'uuid';

import DiaryAPI from 'server/api/diary';
import PostAPI from 'server/api/posts';
import SubscriberAPI from 'server/api/subscribers';
import { SubscriptionType } from 'utils/enum';
import {
  createDiaryNavigatorParams,
  createPostNavigatorParams,
  DOMAINS,
} from 'utils/functions';
import logger from 'utils/logger';

import {
  HTML_TO_TEXT_OPTIONS,
  isProduction,
  prodTransportOptions,
  TRANSPORTER,
} from './constants';
import DiaryEmail from './templates/DiaryEmail';
import ExclusiveEmail from './templates/ExclusiveEmail';
import PostEmail from './templates/PostEmail';
import WishlistEmail from './templates/WishlistEmail';

const adminRecipient: Recipient = {
  firstname: 'Zavid',
  lastname: 'Egbue',
  email: process.env.NEXT_PUBLIC_GOOGLE_EMAIL!,
  token: UUIDv4(),
};
const testRecipient: Recipient = {
  firstname: 'Ozioma',
  lastname: 'Zuluchi',
  email: process.env.ETHEREAL_EMAIL!,
  token: UUIDv4(),
};

/**
 * Send an email to all subscribers of new diary entry.
 * @param diaryEntry The subject diary entry for the email.
 * @param options The notification options.
 */
export async function notifyNewDiaryEntry(
  diaryEntry: Diary,
  options: NotifyOptions = {},
): Promise<SMTPTransport.SentMessageInfo[]> {
  const subject = `Diary Entry #${diaryEntry.entryNumber}: ${diaryEntry.title}`;

  const getDiaryNavigation = (number: number): Promise<Diary | null> =>
    DiaryAPI.find(createDiaryNavigatorParams(number).params);
  const previous = await getDiaryNavigation(diaryEntry.entryNumber - 1);
  const next = await getDiaryNavigation(diaryEntry.entryNumber + 1);

  return sendEmail(
    DiaryEmail,
    { diaryEntry, previous, next },
    subject,
    SubscriptionType.DIARY,
    options,
  );
}

/**
 * Send an email to all subscribers of new post.
 * @param post The post for the email.
 * @param options The notification options.
 */
export async function notifyNewPost(
  post: Post,
  options: NotifyOptions = {},
): Promise<SMTPTransport.SentMessageInfo[]> {
  const { singular: type } = DOMAINS[post.type];
  const index = await PostAPI.index(post.id, post.type);
  const subject = `${capitalize(type)} #${index}: ${post.title}`;

  const getPostNavigation = (op: DateOp): Promise<Post | null> =>
    PostAPI.find(createPostNavigatorParams(post, op).params);
  const previous = await getPostNavigation('lt');
  const next = await getPostNavigation('gt');

  return sendEmail(
    PostEmail,
    { post, previous, next, index },
    subject,
    SubscriptionType[post.type as keyof typeof SubscriptionType],
    options,
  );
}

/**
 * Send an email to all subscribers of new announcement.
 * @param exclusive The announcement for the email.
 * @param options The notification options.
 */
export function notifyExclusive(
  exclusive: Exclusive,
  options: NotifyOptions = {},
): Promise<SMTPTransport.SentMessageInfo[]> {
  return sendEmail(
    ExclusiveEmail,
    { exclusive },
    exclusive.subject,
    SubscriptionType.EXCLUSIVE,
    options,
  );
}

/**
 * Send an email to a claimant who claimed an item.
 * @param wishlistItem The wishlist item to notify about.
 * @param options The notification options.
 */
export function notifyWishlistItemClaimant(
  wishlistItem: WishlistItem,
  options: NotifyOptions = {},
): Promise<SMTPTransport.SentMessageInfo[]> {
  const subject = `You've claimed the ${wishlistItem.name}.`;
  return sendEmail(WishlistEmail, { wishlistItem }, subject, null, options);
}

/**
 * Prepare and process email content.
 * @param template The template element.
 * @param props The template props.
 * @param subject The subject of the email.
 * @param type The subscription type expected of subscribers.
 * @param options The notification options.
 */
async function sendEmail<T extends Record<string, unknown>>(
  template: React.FunctionComponent<any>,
  props: T,
  subject: string,
  type: SubscriptionType | null,
  options: NotifyOptions,
): Promise<SMTPTransport.SentMessageInfo[]> {
  const mailList = await constructMailingList(type, options);
  const promises = mailList.map((recipient) => {
    const element = React.createElement(template, {
      ...props,
      recipient,
    });
    const { html, errors } = mjml2html(renderToMjml(element));
    errors.forEach((e) => {
      logger.error(e.formattedMessage);
    });

    const transporter =
      options.isPreview && options.previewType === 'Gmail'
        ? nodemailer.createTransport(prodTransportOptions)
        : TRANSPORTER;
    return transporter.sendMail({
      from: `ZAVID <${process.env.EMAIL_USER}>`,
      to: recipient.email,
      subject: options.isPreview ? `(Preview) ${subject}` : subject,
      html,
      text: convert(html, HTML_TO_TEXT_OPTIONS),
    });
  });

  const responses = await Promise.all(promises);
  logger.info(
    `Emails: "${subject}" email sent to ${mailList.length} subscriber(s).`,
  );
  return responses;
}

async function constructMailingList(
  type: SubscriptionType | null,
  options: NotifyOptions,
): Promise<(Recipient | Subscriber)[]> {
  if (options.isPreview) {
    const recipient =
      options.previewType === 'Gmail' ? adminRecipient : testRecipient;
    return [recipient];
  }

  if (options.directRecipients) {
    return options.directRecipients.map((email) => ({ email }));
  }

  if (!isProduction) {
    return [testRecipient];
  }

  if (!type) {
    return [];
  }

  let args: Prisma.SubscriberFindManyArgs = {};
  if (options.subscribedRecipients) {
    args = {
      where: { id: { in: options.subscribedRecipients } },
    };
  }

  const subscribers = await SubscriberAPI.findMany(args);
  return subscribers.filter((subscriber) => {
    const subscriptions = subscriber.subscriptions as Record<
      SubscriptionType,
      boolean
    >;
    return subscriptions[type];
  });
}

type Recipient = Pick<Subscriber, 'email'> &
  Partial<Pick<Subscriber, 'firstname' | 'lastname' | 'token'>>;
