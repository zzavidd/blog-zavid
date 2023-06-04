import type { IMjmlSectionProps, IMjmlTextProps } from '@faire/mjml-react';
import {
  MjmlAll,
  MjmlAttributes,
  MjmlBody,
  MjmlColumn,
  MjmlFont,
  MjmlHead,
  MjmlPreview,
  MjmlSection,
  MjmlSocial,
  MjmlSocialElement,
  MjmlTable,
  MjmlText,
  MjmlTitle,
} from '@faire/mjml-react';
import React from 'react';

import Settings from 'utils/settings';

import { EmailTheme } from '../constants';

import { Anchor } from './Components';

export const FOOTER_LINKS = [
  { title: 'Diary', url: '/diary' },
  // { title: 'Wishlist', url: '/wishlist' },
  { title: 'About', url: '/about' },
  { title: 'Privacy Policy', url: '/privacy' },
];

export const FOOTER_SOCIALS = ['twitter', 'instagram', 'linkedin'];

export function EmailHead({ title }: EmailHeadProps) {
  return (
    <MjmlHead>
      <MjmlTitle>{title}</MjmlTitle>
      <MjmlPreview>{title}</MjmlPreview>
      <MjmlAttributes>
        <MjmlAll name={'color-scheme'} content={'light dark'} />
        <MjmlAll name={'supported-color-schemes'} content={'light dark'} />
        <MjmlAll fontFamily={'Mulish'} />
        <MjmlText padding={0} />
      </MjmlAttributes>
      <MjmlFont
        name={EmailTheme.Font.Title}
        href={`https://fonts.googleapis.com/css?family=${EmailTheme.Font.Title}`}
      />
      <MjmlFont
        name={EmailTheme.Font.Body}
        href={`https://fonts.googleapis.com/css?family=${EmailTheme.Font.Body}`}
      />
    </MjmlHead>
  );
}

export function EmailBody({ children }: React.PropsWithChildren) {
  return (
    <MjmlBody backgroundColor={EmailTheme.Color.Dark.Body} width={576}>
      {children}
    </MjmlBody>
  );
}

export function EmailHeader({ children }: React.PropsWithChildren) {
  return (
    <MjmlSection backgroundColor={EmailTheme.Color.Dark.Primary} padding={0}>
      <MjmlColumn>
        <MjmlText
          color={EmailTheme.Color.Dark.Text}
          fontSize={14}
          padding={'16px 24px'}>
          {children}
        </MjmlText>
      </MjmlColumn>
    </MjmlSection>
  );
}

export function Main({ children }: IMjmlSectionProps) {
  return (
    <MjmlSection
      backgroundColor={EmailTheme.Color.Light.Secondary}
      padding={24}>
      <MjmlColumn>{children}</MjmlColumn>
    </MjmlSection>
  );
}

export function EmailFooter(props: EmailFooterProps) {
  return (
    <MjmlSection
      backgroundColor={EmailTheme.Color.Dark.Secondary}
      textAlign={'center'}>
      <MjmlColumn width={'70%'}>
        {props.showUnsubscribe ? (
          <React.Fragment>
            <EmailFooterText>
              You are receiving this email because you subscribed to my mailing
              list. If you want to change your subscription preferences or
              unsubscribe,&nbsp;
              <Anchor
                href={`${Settings.DOMAIN}/subscriptions?token=${props.unsubscribeToken}`}>
                click here
              </Anchor>
              .
            </EmailFooterText>
            <EmailFooterText>
              Got an issue with the link? Copy and paste this URL into your
              browser:&nbsp;
              <Anchor href={props.url}>{props.url}</Anchor>
            </EmailFooterText>
          </React.Fragment>
        ) : null}
        <MjmlTable align={'center'}>
          {FOOTER_LINKS.map(({ title, url }) => {
            return (
              <tr key={url}>
                <td style={{ textAlign: 'center' }}>
                  <Anchor
                    href={`${Settings.DOMAIN}${url}`}
                    style={{
                      color: EmailTheme.Color.Dark.Text,
                      fontSize: 14,
                      fontWeight: 600,
                    }}>
                    {title}
                  </Anchor>
                </td>
              </tr>
            );
          })}
        </MjmlTable>
        <MjmlText align={'center'} padding={0}>
          <a href={Settings.DOMAIN}>
            <img
              src={`${Settings.CLOUDINARY_BASE_URL}/static/logos/zavid-head-logo.png`}
              alt={'ZAVID'}
              width={100}
              height={100}
            />
          </a>
        </MjmlText>
        <MjmlText
          align={'center'}
          color={EmailTheme.Color.Dark.Text}
          padding={0}>
          <p>{Settings.COPYRIGHT}</p>
        </MjmlText>
        <MjmlSocial mode={'horizontal'} iconSize={28} padding={0}>
          {FOOTER_SOCIALS.map((account, key) => {
            return (
              <MjmlSocialElement
                name={account}
                href={
                  Settings.ACCOUNTS[account as keyof typeof Settings.ACCOUNTS]
                }
                key={key}
              />
            );
          })}
        </MjmlSocial>
      </MjmlColumn>
    </MjmlSection>
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

function EmailFooterText(props: IMjmlTextProps) {
  return (
    <MjmlText
      align={'center'}
      color={EmailTheme.Color.Dark.Text}
      fontSize={14}
      padding={'12px 0'}
      lineHeight={24}
      {...props}
    />
  );
}

interface EmailHeadProps {
  title: string;
}

interface EmailFooterProps extends IMjmlSectionProps {
  showUnsubscribe: boolean;
  unsubscribeToken?: string;
  url?: string;
}
