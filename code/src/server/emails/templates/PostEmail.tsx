import { Mjml, MjmlText } from '@faire/mjml-react';
import { capitalize } from '@mui/material';
import type { Post } from '@prisma/client';

import { SubscriptionType } from 'utils/enum';
import { DOMAINS } from 'utils/functions';
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

export default function PostEmail({ post, index, token }: PostEmailProps) {
  const { singular, collection: domain } = DOMAINS[post.type];
  const title = `${capitalize(singular)} #${index}: ${post.title}`;
  const href = `${Settings.DOMAIN}/${domain}/${post.slug}`;

  const contentType =
    Object.values(SubscriptionType)[
      Object.keys(SubscriptionType).indexOf(post.type)
    ];
  return (
    <Mjml>
      <EmailHead title={title} preview={post.excerpt} />
      <EmailBody>
        <EmailHeader>
          New {singular} on ZAVID.&nbsp;
          <Anchor href={href}>Visit on site.</Anchor>
        </EmailHeader>
        <Main>
          <EmailTitle>{title}</EmailTitle>
          <EmailDate date={post.datePublished} />
          <EmailDivider />
          <EmailParagraph>{post.content}</EmailParagraph>
          <MjmlText>
            <SignatureImage />
          </MjmlText>
        </Main>
        <EmailFooter
          showUnsubscribe={true}
          unsubscribeToken={token}
          contentType={contentType}
        />
      </EmailBody>
    </Mjml>
  );
}

interface PostEmailProps {
  post: Post;
  index: number;
  token: string;
}
