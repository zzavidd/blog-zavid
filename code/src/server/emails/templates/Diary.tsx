import { Mjml, MjmlText } from '@faire/mjml-react';
import type { Diary } from '@prisma/client';

import Settings from 'utils/settings';

import {
  Anchor,
  EmailDate,
  EmailDivider,
  EmailParagraph,
  EmailTitle,
} from '../lib/Components';
import {
  EmailBody,
  EmailFooter,
  EmailHead,
  EmailHeader,
  Main,
  SignatureImage,
} from '../lib/Fragments';

export default function DiaryEmail({ diaryEntry, token }: DiaryEmailProps) {
  const title = `Diary Entry #${diaryEntry.entryNumber}: ${diaryEntry.title}`;
  const href = `${Settings.DOMAIN}/diary/${diaryEntry.entryNumber}`;
  return (
    <Mjml>
      <EmailHead title={title} />
      <EmailBody>
        <EmailHeader>
          New diary entry on ZAVID.&nbsp;
          <Anchor href={href}>Visit on site.</Anchor>
        </EmailHeader>
        <Main>
          <EmailTitle>{title}</EmailTitle>
          <EmailDate date={diaryEntry.date} />
          <EmailDivider />
          <EmailParagraph>{diaryEntry.content}</EmailParagraph>
          <MjmlText>
            <SignatureImage />
          </MjmlText>
          <EmailParagraph>{diaryEntry.footnote}</EmailParagraph>
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
