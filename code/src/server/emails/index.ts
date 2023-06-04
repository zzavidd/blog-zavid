import { renderToMjml } from '@faire/mjml-react/utils/renderToMjml';
import type { Diary, Subscriber } from '@prisma/client';
import htmlToText from 'html-to-text';
import mjml2html from 'mjml';
import type { SentMessageInfo } from 'nodemailer';
import nodemailer from 'nodemailer';
import React from 'react';
import * as UUID from 'uuid';

import SubscriberAPI from 'server/api/subscribers';
import { SubscriptionType } from 'utils/enum';
import Logger from 'utils/logger';

import { HTML_TO_TEXT_OPTIONS, isProd, TRANSPORTER } from './constants';
import DiaryEmail from './templates/Diary';

/** The email address of the recipient in development. */
const testRecipient: TestRecipient = {
  email: process.env.ETHEREAL_EMAIL!,
  token: UUID.v4(),
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
  ): Promise<string> {
    const subject = `Diary Entry #${diaryEntry.entryNumber}: ${diaryEntry.title}`;
    return prepareEmail(
      DiaryEmail,
      { diaryEntry },
      subject,
      SubscriptionType.Diary,
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
async function prepareEmail<T extends Record<string, unknown>>(
  template: React.FunctionComponent<any>,
  props: T,
  subject: string,
  type: SubscriptionType,
  options: NotifyOptions,
): Promise<string> {
  const subscribers = await SubscriberAPI.findMany({});
  const shouldUseTestRecipient = !isProd || options.isTest;

  // Retrieve list of subscribers to corresponding type
  const mailList: Subscriber[] | [TestRecipient] = shouldUseTestRecipient
    ? [testRecipient]
    : subscribers.filter((subscriber) => {
        const subscriptions = subscriber.subscriptions as Record<
          SubscriptionType,
          boolean
        >;
        const isSubscribed = subscriptions[type];
        return isSubscribed;
      });

  const promises = mailList.map((recipient) => {
    const element = React.createElement(template, {
      ...props,
      token: recipient.token,
    });
    const { html, errors } = mjml2html(renderToMjml(element));
    errors.forEach((e) => {
      Logger.error(e.formattedMessage);
    });
    return sendMailToAddress(recipient.email, subject, html);
  });
  const [previewUrl] = await Promise.all(promises);
  Logger.info(
    `Emails: "${subject}" email sent to ${mailList.length} subscribers.`,
  );
  return previewUrl;
}

/**
 * Send the email to a subscriber.
 * @param recipient The email address of the recipient.
 * @param subject The subject of the email.
 * @param html The content of the message.
 */
async function sendMailToAddress(
  recipient: string,
  subject: string,
  html: string,
): Promise<string> {
  const info = await TRANSPORTER.sendMail({
    from: `ZAVID <${process.env.EMAIL_USER}>`,
    to: recipient,
    subject,
    html,
    text: htmlToText.fromString(html, HTML_TO_TEXT_OPTIONS),
  });
  const url = nodemailer.getTestMessageUrl(info as SentMessageInfo) || '';
  Logger.info(`Preview URL: ${url}`);
  return url;
}

interface NotifyOptions {
  isTest?: boolean;
}

interface TestRecipient {
  email: string;
  token: string;
}
