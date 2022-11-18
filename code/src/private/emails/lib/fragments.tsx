/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @next/next/google-font-display */
/* eslint-disable @next/next/no-head-element */
/* eslint-disable @next/next/no-img-element */
import React from 'react';

import Settings from 'constants/settings';

import { EmailStyle, EmailTheme } from '../constants';

import { Anchor } from './components';

const Theme = EmailStyle.Color[EmailTheme];

export const FOOTER_LINKS = [
  { title: 'Diary', url: '/diary' },
  { title: 'Wishlist', url: '/wishlist' },
  { title: 'About', url: '/about' },
  { title: 'Privacy Policy', url: '/privacy' },
];

export const FOOTER_SOCIALS: FooterSocial[] = [
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

export function Head() {
  return (
    <head>
      <meta name={'viewport'} content={'width=device-width, initial-scale=1'} />
      <meta name={'color-scheme'} content={'light dark'} />
      <meta name={'supported-color-schemes'} content={'light dark'} />
      <link
        href={'https://fonts.googleapis.com/css?family=Mulish:400,700'}
        rel={'stylesheet'}
        type={'text/css'}
      />
    </head>
  );
}

export function Body({
  children,
  ...props
}: React.HTMLAttributes<HTMLBodyElement>) {
  return (
    <body
      style={{
        background: Theme.Body,
        fontFamily: EmailStyle.Font,
        margin: '0 auto',
        maxWidth: '576px',
        ...props.style,
      }}>
      {children}
    </body>
  );
}

export function Header(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        background: Theme.Primary,
        color: Theme.Text,
        fontSize: '0.8em',
        padding: '1em 2em',
      }}>
      {props.children}
    </div>
  );
}

export function Main(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        background: Theme.Secondary,
        color: Theme.Text,
        fontSize: '1.1em',
        lineHeight: 1.5,
        margin: '0 auto',
        padding: '1.5em',
      }}>
      {props.children}
    </div>
  );
}

export function Footer(props: FooterProps) {
  return (
    <div
      style={{
        background: Theme.Primary,
        color: Theme.Text,
        fontSize: '0.9em',
        padding: '2em 1em',
        textAlign: 'center',
      }}>
      {props.showUnsubscribe ? (
        <React.Fragment>
          <FooterText>
            You are receiving this email because you subscribed to my mailing
            list. If you want to change your subscription preferences or
            unsubscribe,&nbsp;
            <Anchor
              href={`${Settings.DOMAIN}/subscriptions?token=${props.unsubscribeToken}`}
              className={'hyperlink'}>
              click here
            </Anchor>
            .
          </FooterText>
          <FooterText>
            Got an issue with the link? Copy and paste this URL into your
            browser:&nbsp;
            <Anchor href={props.url}>{props.url}</Anchor>
          </FooterText>
        </React.Fragment>
      ) : null}
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
                  style={{
                    color: Theme.Text,
                    textDecoration: 'none',
                  }}>
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
    </div>
  );
}

export function SignatureImage() {
  return (
    <img
      src={`${Settings.CLOUDINARY_BASE_URL}/static/logos/signature-dark.png`}
      alt={'Signature'}
      width={131}
      height={103}
    />
  );
}

export function FooterText({
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      style={{
        fontSize: '0.95em',
        lineHeight: 1.6,
        margin: '1.8em auto',
        maxWidth: '350px',
      }}
      {...props}>
      {children}
    </p>
  );
}

interface FooterProps {
  showUnsubscribe: boolean;
  unsubscribeToken?: string;
  url?: string;
}

interface FooterSocial {
  account: keyof typeof Settings.ACCOUNTS;
  image: string;
  alt: string;
}
