import type { IMjmlTextProps } from '@faire/mjml-react';
import { MjmlDivider, MjmlText } from '@faire/mjml-react';
import type React from 'react';

import ZDate from 'utils/lib/date';
import * as ZText from 'utils/lib/text';

import EmailTheme from '../theme';

export function EmailTitle({ children, ...props }: IMjmlTextProps) {
  return (
    <MjmlText
      {...props}
      fontFamily={EmailTheme.Font.Title}
      fontSize={14}
      letterSpacing={-1.5}
      lineHeight={32}>
      <h1 style={{ margin: 0 }}>{children}</h1>
    </MjmlText>
  );
}

export function EmailDate({ date, ...props }: EmailDateProps) {
  return (
    <MjmlText {...props} fontSize={14}>
      <p style={{ margin: '10px 0' }}>{ZDate.format(date)}</p>
    </MjmlText>
  );
}

export function Anchor({
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      rel={'noopener noreferrer'}
      target={'_blank'}
      style={{
        color: EmailTheme.Color.Dark.Hyperlink,
        ...props.style,
      }}>
      {children}
    </a>
  );
}

export function EmailParagraph({ children, ...props }: EmailParagraphProps) {
  return (
    <MjmlText
      fontFamily={EmailTheme.Font.Body}
      fontSize={16}
      lineHeight={24}
      padding={0}
      {...props}>
      {ZText.formatText(children, { forEmails: true })}
    </MjmlText>
  );
}

export function EmailDivider() {
  return (
    <MjmlDivider
      borderColor={'rgba(0,0,0,0.6)'}
      borderWidth={2}
      padding={'10px 0'}
    />
  );
}

interface EmailDateProps extends IMjmlTextProps {
  date: Date | null;
}

interface EmailParagraphProps extends IMjmlTextProps {
  children: string;
}
