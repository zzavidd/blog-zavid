import { Mjml, MjmlText } from '@faire/mjml-react';
import React from 'react';

import { SubscriptionType } from 'utils/enum';
import * as zText from 'utils/lib/text';
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
      <EmailHead
        title={title}
        preview={zText.extractExcerpt(diaryEntry.content)}
      />
      <EmailBody>
        <EmailHeader>
          New diary entry on ZAVID.&nbsp;
          <Anchor href={href}>Visit on site.</Anchor>
        </EmailHeader>
        <Main>
          <EmailDate date={diaryEntry.date} />
          <EmailTitle>{title}</EmailTitle>
          <MjmlText fontSize={12}>
            <p style={{ margin: '10px 0' }}>
              {diaryEntry.categories?.map(({ id, name }, key) => (
                <React.Fragment key={id}>
                  {key ? <span style={{ margin: '0 5px' }}>•</span> : null}
                  <span>{name.toUpperCase()}</span>
                </React.Fragment>
              ))}
            </p>
          </MjmlText>
          <EmailDivider />
          <EmailParagraph>{diaryEntry.content}</EmailParagraph>
          <MjmlText>
            <SignatureImage />
          </MjmlText>
          <EmailParagraph>{diaryEntry.footnote}</EmailParagraph>
        </Main>
        <EmailFooter
          contentType={SubscriptionType.DIARY}
          showUnsubscribe={true}
          unsubscribeToken={token}
        />
      </EmailBody>
    </Mjml>
  );
}

interface DiaryEmailProps {
  diaryEntry: DiaryWithCategories;
  token: string;
}
