import { Mjml, MjmlText } from '@faire/mjml-react';
import type { Exclusive, Subscriber } from '@prisma/client';

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

export default function ExclusiveEmail({
  exclusive,
  recipient,
}: ExclusiveEmailProps) {
  return (
    <Mjml>
      <EmailHead title={exclusive.subject} preview={exclusive.preview} />
      <EmailBody>
        <EmailHeader>
          This is a subscriber-only exclusive from ZAVID.
        </EmailHeader>
        <Main>
          <EmailParagraph>
            {embedSubscriber(exclusive, recipient.firstname)}
          </EmailParagraph>
          <MjmlText>
            <SignatureImage />
          </MjmlText>
        </Main>
        <EmailFooter
          showUnsubscribe={true}
          unsubscribeToken={recipient.token}
          contentType={SubscriptionType.EXCLUSIVE}
        />
      </EmailBody>
    </Mjml>
  );
}

interface ExclusiveEmailProps {
  exclusive: Exclusive;
  recipient: Subscriber;
}
