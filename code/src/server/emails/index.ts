import { renderToMjml } from '@faire/mjml-react/utils/renderToMjml';
import type { Diary, Subscriber } from '@prisma/client';
import htmlToText from 'html-to-text';
import mjml2html from 'mjml';
import type SMTPPool from 'nodemailer/lib/smtp-pool';
import React from 'react';
import invariant from 'tiny-invariant';
import { v4 as UUIDv4 } from 'uuid';

import SubscriberAPI from 'server/api/subscribers';
import { SubscriptionType } from 'utils/enum';
import Logger from 'utils/logger';

import {
  HTML_TO_TEXT_OPTIONS,
  isProd as isProduction,
  TRANSPORTER,
} from './constants';
import DiaryEmail from './templates/Diary';

/** The email address of the recipient in development. */
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
  ): Promise<SMTPPool.SentMessageInfo[]> {
    const subject = `Diary Entry #${diaryEntry.entryNumber}: ${diaryEntry.title}`;
    return sendEmail(
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
async function sendEmail<T extends Record<string, unknown>>(
  template: React.FunctionComponent<any>,
  props: T,
  subject: string,
  type: SubscriptionType,
  options: NotifyOptions,
): Promise<SMTPPool.SentMessageInfo[]> {
  const subscribers = await SubscriberAPI.findMany({});

  let mailList: Subscriber[] | [TestRecipient] = [];

  if (isProduction) {
    if (options.isTest) {
      const recipient = subscribers.find(
        (s) => s.email === process.env.NEXT_PUBLIC_GOOGLE_EMAIL!,
      );
      invariant(recipient, 'No admin recipient found.');
      mailList = [recipient];
    } else {
      mailList = subscribers.filter((subscriber) => {
        const subscriptions = subscriber.subscriptions as Record<
          SubscriptionType,
          boolean
        >;
        return subscriptions[type];
      });
    }
  } else {
    mailList = [testRecipient];
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
    return TRANSPORTER.sendMail({
      from: `ZAVID <${process.env.EMAIL_USER}>`,
      to: recipient.email,
      subject: options.isTest ? 'Test Email' : subject,
      html,
      text: htmlToText.fromString(html, HTML_TO_TEXT_OPTIONS),
    });
  });

  const responses = await Promise.all(promises);
  Logger.info(
    `Emails: "${subject}" email sent to ${mailList.length} subscribers.`,
  );
  return responses;
}

interface NotifyOptions {
  isTest?: boolean;
}

interface TestRecipient {
  email: string;
  token: string;
}
