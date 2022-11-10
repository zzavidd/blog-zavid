/* eslint-disable @next/next/no-head-element */
/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/google-font-display */

import React from 'react';

import type WishlistDAO from 'classes/wishlist/WishlistDAO';
import Settings from 'constants/settings';

const FOOTER_LINKS = [
  { title: 'Wishlist', url: '/wishlist' },
  { title: 'About', url: '/about' },
  { title: 'Privacy Policy', url: '/privacy' },
];

const FOOTER_SOCIALS: FooterSocial[] = [
  {
    account: 'twitter',
    image: 'twitter-icon',
    alt: 'TW',
  },
  {
    account: 'instagram',
    image: 'instagram-icon',
    alt: 'IN',
  },
  {
    account: 'linkedin',
    image: 'linkedin-icon',
    alt: 'LI',
  },
  {
    account: 'snapchat',
    image: 'snapchat-logo',
    alt: 'SC',
  },
];

const COLOR = {
  Primary: '#111111',
  Secondary: '#080808',
  White: '#ffffff',
};

const FONT = 'Mulish';

function WishlistEmail({ wishlistItem }: { wishlistItem: WishlistDAO }) {
  return (
    <html>
      <head>
        <meta
          name={'viewport'}
          content={'width=device-width, initial-scale=1'}
        />
        <meta name={'color-scheme'} content={'light'} />
        <meta name={'supported-color-schemes'} content={'light'} />

        <link
          href={'https://fonts.googleapis.com/css?family=Mulish:400,700'}
          rel={'stylesheet'}
          type={'text/css'}
        />
      </head>
      <body
        style={{
          background: COLOR.Secondary,
          fontFamily: FONT,
          margin: '0 auto',
          maxWidth: '576px',
        }}>
        <Header>Confirming your claim to a wishlist item on ZAVID.</Header>
        <Main>
          <Paragraph>Hey friend,</Paragraph>
          <img
            src={wishlistItem.image}
            alt={wishlistItem.name}
            style={{
              borderRadius: '10px',
              float: 'right',
              marginLeft: '1.5em',
              maxWidth: '160px',
            }}
          />
          <Paragraph>
            You claimed the <strong>{wishlistItem.name}</strong> on my wishlist.
            Click the button below to take you to the link.
          </Paragraph>

          <Anchor href={wishlistItem.href}>
            <button
              type={'button'}
              style={{
                background: COLOR.Primary,
                border: `1px solid ${COLOR.White}`,
                borderRadius: '10px',
                color: COLOR.White,
                cursor: 'pointer',
                fontFamily: FONT,
                fontSize: '0.85em',
                fontWeight: 'bold',
                padding: '1.2em',
                textDecoration: 'none',
              }}>
              Visit Link
            </button>
          </Anchor>

          <Paragraph>
            I appreciate you immensely for wanting to get me a gift off my
            wishlist. It really means a lot.
          </Paragraph>
          <Paragraph>
            In case you need to send the gift, below is my postal address:
          </Paragraph>

          <Paragraph style={{ fontStyle: 'italic' }}>
            40 Impala Drive
            <br />
            Cambridge
            <br />
            CB1 9XL
          </Paragraph>

          <Paragraph>Bless you, friend. Much love.</Paragraph>
          <Paragraph>Signed.</Paragraph>
          <img
            src={`${Settings.CLOUDINARY_BASE_URL}/static/logos/signature-light.png`}
            alt={'Signature'}
            width={131}
            height={103}
          />
        </Main>
        <Footer>
          <table
            style={{
              fontSize: '0.95em',
              margin: '0.8em auto',
              textAlign: 'center',
              width: '80%',
            }}>
            {FOOTER_LINKS.map(({ title, url }) => {
              return (
                <tr key={url}>
                  <td>
                    <a
                      href={`${Settings.DOMAIN}${url}`}
                      style={{ color: COLOR.White, textDecoration: 'none' }}>
                      {title}
                    </a>
                  </td>
                </tr>
              );
            })}
          </table>
          <table style={{ margin: '0.8em auto', width: '145px' }}>
            <tr>
              {FOOTER_SOCIALS.map(({ account, image, alt }, key) => {
                return (
                  <td key={key}>
                    <Anchor href={Settings.ACCOUNTS[account]}>
                      <img
                        src={`${Settings.CLOUDINARY_BASE_URL}/static/logos/socials/${image}.png`}
                        alt={alt}
                        style={{
                          borderRadius: '7px',
                          width: '100%',
                        }}
                      />
                    </Anchor>
                  </td>
                );
              })}
            </tr>
          </table>
          <Anchor href={Settings.DOMAIN}>
            <img
              src={`${Settings.CLOUDINARY_BASE_URL}/static/logos/zavid-head-logo.png`}
              alt={'ZAVID'}
              style={{
                borderRadius: '50%',
                marginBlock: '0.8em',
                width: '145px',
              }}
            />
          </Anchor>
          <div>{Settings.COPYRIGHT}</div>
        </Footer>
      </body>
    </html>
  );
}

export default WishlistEmail;

function Header(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        background: '#111111',
        color: '#ffffff',
        fontSize: '0.8em',
        padding: '1em 2em',
      }}>
      {props.children}
    </div>
  );
}

function Main(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        background: '#202020',
        color: '#ffffff',
        fontSize: '1.1em',
        lineHeight: 1.5,
        margin: '0 auto',
        padding: '1.5em',
      }}>
      {props.children}
    </div>
  );
}

function Footer(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        background: '#111111',
        color: '#ffffff',
        fontSize: '0.9em',
        padding: '1em',
        textAlign: 'center',
      }}>
      {props.children}
    </div>
  );
}

function Anchor({
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a rel={'noopener noreferrer'} {...props}>
      {children}
    </a>
  );
}

function Paragraph({
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      style={{ fontSize: '0.95em', lineHeight: 1.6, marginBlock: '1.8em' }}
      {...props}>
      {children}
    </p>
  );
}

interface FooterSocial {
  account: keyof typeof Settings.ACCOUNTS;
  image: string;
  alt: string;
}
