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

import type { SubscriptionType } from 'utils/enum';
import Settings from 'utils/settings';

import EmailTheme, { BODY_FONTS, TITLE_FONTS } from '../theme';

import { Anchor } from './Components';

const FOOTER_LINKS = [
  { title: 'Diary', url: '/diary' },
  // { title: 'Wishlist', url: '/wishlist' },
  { title: 'About', url: '/about' },
  { title: 'Privacy Policy', url: '/privacy' },
];
const FOOTER_SOCIALS = ['twitter', 'instagram', 'linkedin'];

export function EmailHead({ title, preview }: EmailHeadProps) {
  return (
    <MjmlHead>
      <MjmlTitle>{title}</MjmlTitle>
      <MjmlPreview>{preview}</MjmlPreview>
      <MjmlAttributes>
        <MjmlAll name={'color-scheme'} content={'light,dark'} />
        <MjmlAll name={'supported-color-schemes'} content={'light,dark'} />
        <MjmlAll fontFamily={EmailTheme.Font.Body} />
        <MjmlText padding={0} />
      </MjmlAttributes>
      {TITLE_FONTS.concat(BODY_FONTS).map((font) => (
        <MjmlFont
          name={font}
          href={`https://fonts.googleapis.com/css?family=${font}`}
          key={font}
        />
      ))}
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

export function EmailFooter({
  contentType,
  showUnsubscribe,
  unsubscribeToken,
}: EmailFooterProps) {
  return (
    <MjmlSection
      backgroundColor={EmailTheme.Color.Dark.Secondary}
      padding={24}
      textAlign={'center'}>
      <MjmlColumn width={'70%'}>
        {showUnsubscribe ? (
          <React.Fragment>
            <EmailFooterText>
              You are receiving this email because you are subscribed to
              my&nbsp;{contentType}. You can&nbsp;
              <Anchor
                href={`${Settings.DOMAIN}/subscriptions?token=${unsubscribeToken}`}>
                manage your subscription preferences here
              </Anchor>
              .
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
      fontSize={12}
      padding={'12px 0'}
      lineHeight={18}
      {...props}
    />
  );
}

interface EmailHeadProps {
  title: string;
  preview: string;
}

interface EmailFooterProps extends IMjmlSectionProps {
  contentType: SubscriptionType;
  showUnsubscribe: boolean;
  unsubscribeToken?: string;
}
