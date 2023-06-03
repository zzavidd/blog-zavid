import { Mjml, MjmlText } from '@faire/mjml-react';
import type { Diary } from '@prisma/client';

import ZDate from 'utils/lib/date';
import * as ZText from 'utils/lib/text';
import Settings from 'utils/settings';

import { Anchor, Heading as EmailTitle } from '../lib/Components';
import {
  EmailBody,
  EmailFooter,
  EmailHead,
  Header,
  Main,
  SignatureImage,
} from '../lib/Fragments';

export default function DiaryEmail({ diaryEntry, token }: DiaryEmailProps) {
  const title = `#${diaryEntry.entryNumber}: ${diaryEntry.title}`;
  const href = `${Settings.DOMAIN}/diary/${diaryEntry.entryNumber}`;
  return (
    <Mjml>
      <EmailHead title={title} />
      <EmailBody>
        <Header>
          New diary entry on ZAVID.&nbsp;
          <Anchor href={href}>Visit on site.</Anchor>
        </Header>
        <Main>
          <EmailTitle>{diaryEntry.title}</EmailTitle>
          <MjmlText>
            <p>{ZDate.format(diaryEntry.date)}</p>
          </MjmlText>
          {ZText.formatText(diaryEntry.content, { forEmails: true })}
          <MjmlText>
            <SignatureImage />
          </MjmlText>
          {ZText.formatText(diaryEntry.footnote, { forEmails: true })}
        </Main>
        <EmailFooter
          showUnsubscribe={true}
          unsubscribeToken={token}
          url={href}
        />
      </EmailBody>
    </Mjml>
  );
}

interface DiaryEmailProps {
  diaryEntry: Diary;
  token: string;
}
