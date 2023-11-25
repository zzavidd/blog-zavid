import { Mjml, MjmlText } from '@faire/mjml-react';
import type { WishlistItem } from '@prisma/client';

import { EmailParagraph } from '../lib/Components';
import {
  EmailBody,
  EmailFooter,
  EmailHead,
  EmailHeader,
  Main,
  SignatureImage,
} from '../lib/Fragments';

export default function WishlistEmail({ wishlistItem }: WishlistEmailProps) {
  const text = generateText(wishlistItem);
  const preview = `You claimed the ${wishlistItem.name}. Here's some more info in case ya need it.`;
  return (
    <Mjml>
      <EmailHead title={"Zavid's Wishlist"} preview={preview} />
      <EmailBody>
        <EmailHeader>
          Confirming your claim on an item from Zavid&apos;s Wishlist.
        </EmailHeader>
        <Main>
          <EmailParagraph>{text}</EmailParagraph>
          <MjmlText>
            <SignatureImage />
          </MjmlText>
        </Main>
        <EmailFooter showUnsubscribe={false} />
      </EmailBody>
    </Mjml>
  );
}

function generateText(wishlistItem: WishlistItem) {
  const text = [
    'Hey pal,',
    `You've claimed the [${wishlistItem.name}](${wishlistItem.href}) worth on my wishlist.`,
    `![${wishlistItem.name}](${wishlistItem.image}){?mh=200}`,
    wishlistItem.comments
      ? `> ***Note from Zavid:***\r\r${wishlistItem.comments}`
      : null,
    'In case you need to send the gift, below is my postal address:',
    '> 40 Impala Drive\nCambridge\nCB1 9XL',
    'I appreciate you immensely for wanting to get me a gift off my wishlist. It really means a lot.',
    'Big love.',
  ];

  return text.filter(Boolean).join('\n\n');
}

interface WishlistEmailProps {
  wishlistItem: WishlistItem;
}
