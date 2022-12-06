/* eslint-disable @next/next/no-img-element */

import Settings from 'constants/settings';
import ZDate from 'lib/date';
import * as ZText from 'lib/text';

import { Anchor, Heading } from '../lib/components';
import { Body, Footer, Header, Main, SignatureImage } from '../lib/fragments';

export default function DiaryEmail({ diaryEntry, token }: DiaryEmailProps) {
  const href = `${Settings.DOMAIN}/diary/${diaryEntry.entryNumber}`;
  return (
    <html>
      <Body>
        <Header>
          New diary entry on ZAVID.&nbsp;
          <Anchor href={href}>Visit on site.</Anchor>
        </Header>
        <Main>
          <Heading>{diaryEntry.title}</Heading>
          <p style={{ margin: '0 0 1.5em 0' }}>
            {ZDate.format(diaryEntry.date)}
          </p>

          {ZText.formatText(diaryEntry.content, { forEmails: true })}
          <SignatureImage />
          {ZText.formatText(diaryEntry.footnote, { forEmails: true })}
        </Main>
        <Footer showUnsubscribe={true} unsubscribeToken={token} url={href} />
      </Body>
    </html>
  );
}

interface DiaryEmailProps {
  diaryEntry: DiaryDAO;
  token: string;
}
