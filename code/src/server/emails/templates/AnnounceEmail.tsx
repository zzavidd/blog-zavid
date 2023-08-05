import { Mjml, MjmlText } from '@faire/mjml-react';
import type { Subscriber } from '@prisma/client';

import { SubscriptionType } from 'utils/enum';
import { embedSubscriber } from 'utils/functions';

import { EmailParagraph } from '../lib/Components';
import {
  EmailBody,
  EmailFooter,
  EmailHead,
  EmailHeader,
  Main,
  SignatureImage,
} from '../lib/Fragments';

export default function AnnounceEmail({
  announcement,
  recipient,
}: AnnounceEmailProps) {
  return (
    <Mjml>
      <EmailHead title={announcement.subject} preview={announcement.preview} />
      <EmailBody>
        <EmailHeader>You&#39;ve got a direct message from Zavid.</EmailHeader>
        <Main>
          <EmailParagraph>
            {embedSubscriber(announcement.content, recipient.firstname)}
          </EmailParagraph>
          <MjmlText>
            <SignatureImage />
          </MjmlText>
        </Main>
        <EmailFooter
          showUnsubscribe={true}
          unsubscribeToken={recipient.token}
          contentType={SubscriptionType.ANNOUNCEMENT}
        />
      </EmailBody>
    </Mjml>
  );
}

interface AnnounceEmailProps {
  announcement: SubscriberAnnouncement;
  recipient: Subscriber;
}
