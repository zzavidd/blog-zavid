import { renderToMjml } from '@faire/mjml-react/utils/renderToMjml';
import { capitalize } from '@mui/material';
import type { Diary, Post, Subscriber } from '@prisma/client';
import { convert } from 'html-to-text';
import mjml2html from 'mjml';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import React from 'react';
import { v4 as UUIDv4 } from 'uuid';
import { z } from 'zod';

import PostAPI from 'server/api/posts';
import SubscriberAPI from 'server/api/subscribers';
import { SubscriptionType } from 'utils/enum';
import { DOMAINS } from 'utils/functions';
import Logger from 'utils/logger';

import {
  HTML_TO_TEXT_OPTIONS,
  isProduction,
  prodTransportOptions,
  TRANSPORTER,
} from './constants';
import DiaryEmail from './templates/DiaryEmail';
import PostEmail from './templates/PostEmail';

const adminRecipient: TestRecipient = {
  email: process.env.NEXT_PUBLIC_GOOGLE_EMAIL!,
  token: UUIDv4(),
};
const testRecipient: TestRecipient = {
  email: process.env.ETHEREAL_EMAIL!,
  token: UUIDv4(),
};

namespace Emailer {
  /**
   * Send an email to all subscribers of new diary entry.
   * @param diaryEntry The subject diary entry for the email.
   * @param options The notification options.
   */
  export function notifyNewDiaryEntry(
    diaryEntry: Diary,
    options: NotifyOptions = {},
  ): Promise<SMTPTransport.SentMessageInfo[]> {
    const subject = `Diary Entry #${diaryEntry.entryNumber}: ${diaryEntry.title}`;
    return sendEmail(
      DiaryEmail,
      { diaryEntry },
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
    return sendEmail(
      PostEmail,
      { post, index },
      subject,
      SubscriptionType[post.type as keyof typeof SubscriptionType],
      options,
    );
  }
}

export default Emailer;

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
  type: SubscriptionType,
  options: NotifyOptions,
): Promise<SMTPTransport.SentMessageInfo[]> {
  const subscribers = await SubscriberAPI.findMany({});

  let mailList: Subscriber[] | [TestRecipient] = [];

  if (options.isPreview) {
    const recipient =
      options.previewType === 'Gmail' ? adminRecipient : testRecipient;
    mailList = [recipient];
  } else {
    if (isProduction) {
      mailList = subscribers.filter((subscriber) => {
        const subscriptions = subscriber.subscriptions as Record<
          SubscriptionType,
          boolean
        >;
        return subscriptions[type];
      });
    } else {
      mailList = [testRecipient];
    }
  }

  const promises = mailList.map((recipient) => {
    const element = React.createElement(template, {
      ...props,
      token: recipient.token,
    });
    const { html, errors } = mjml2html(renderToMjml(element));
    errors.forEach((e) => {
      Logger.error(e.formattedMessage);
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
  Logger.info(
    `Emails: "${subject}" email sent to ${mailList.length} subscribers.`,
  );
  return responses;
}

export const zEmailPreviewType = z.enum(['Ethereal', 'Gmail']);

export type EmailPreviewType = z.infer<typeof zEmailPreviewType>;

interface NotifyOptions {
  isPreview?: boolean;
  previewType?: EmailPreviewType;
}

interface TestRecipient {
  email: string;
  token: string;
}
