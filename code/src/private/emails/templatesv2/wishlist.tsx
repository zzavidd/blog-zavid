/* eslint-disable @next/next/no-img-element */

import type WishlistDAO from 'classes/wishlist/WishlistDAO';

import { EmailStyle, EmailTheme } from '../constants';
import { Anchor, Blockquote, Button, Paragraph } from '../lib/components';
import { Body, Footer, Header, Main, SignatureImage } from '../lib/fragments';

const Theme = EmailStyle.Color[EmailTheme];

export default function WishlistEmail({ wishlistItem }: WishlistEmailProps) {
  return (
    <html>
      <Body>
        <Header>Confirming your claim to a wishlist item on ZAVID.</Header>
        <Main>
          <Paragraph>Hey friend,</Paragraph>
          <img
            src={wishlistItem.image}
            alt={wishlistItem.name}
            style={{
              border: `1px solid ${Theme.Text}`,
              borderRadius: '10px',
              float: 'right',
              marginLeft: '1.5em',
              maxWidth: '40%',
            }}
          />
          <Paragraph>
            You claimed the <strong>{wishlistItem.name}</strong> on my wishlist.
          </Paragraph>
          {wishlistItem.comments ? (
            <Blockquote>
              Note from me:
              <br />
              <br />
              &ldquo;{wishlistItem.comments}&rdquo;
            </Blockquote>
          ) : null}
          <Paragraph>Click the button below to take you to the link.</Paragraph>
          <Anchor href={wishlistItem.href}>
            <Button>Visit Link</Button>
          </Anchor>
          <Paragraph>
            I appreciate you immensely for wanting to get me a gift off my
            wishlist. It really means a lot.
          </Paragraph>
          <Paragraph>
            In case you need to send the gift, below is my postal address:
          </Paragraph>
          <Blockquote style={{ fontStyle: 'italic' }}>
            40 Impala Drive
            <br />
            Cambridge
            <br />
            CB1 9XL
          </Blockquote>
          <Paragraph>Bless you, friend. Much love.</Paragraph>
          <Paragraph>Signed.</Paragraph>
          <SignatureImage />
        </Main>
        <Footer showUnsubscribe={false} />
      </Body>
    </html>
  );
}

interface WishlistEmailProps {
  wishlistItem: WishlistDAO;
}
