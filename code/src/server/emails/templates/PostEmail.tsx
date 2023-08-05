import { Mjml, MjmlText } from '@faire/mjml-react';
import { capitalize } from '@mui/material';
import type { Post, Subscriber } from '@prisma/client';

import { SubscriptionType } from 'utils/enum';
import { DOMAINS, createPostNavigationInfo } from 'utils/functions';
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
  EmailNavigation,
  Main,
  SignatureImage,
} from '../lib/Fragments';

export default function PostEmail({
  post,
  previous,
  next,
  index,
  recipient,
}: PostEmailProps) {
  const { singular, collection: domain } = DOMAINS[post.type];
  const title = `${capitalize(singular)} #${index}: ${post.title}`;
  const href = `${Settings.DOMAIN}/${domain}/${post.slug}`;

  const contentType =
    Object.values(SubscriptionType)[
      Object.keys(SubscriptionType).indexOf(post.type)
    ];

  const navigationProps: ContentNavigationProps = {
    previous: createPostNavigationInfo(previous, index - 1),
    next: createPostNavigationInfo(next, index + 1),
  };
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
          <EmailNavigation {...navigationProps} />
        </Main>
        <EmailFooter
          showUnsubscribe={true}
          unsubscribeToken={recipient.token}
          contentType={contentType}
        />
      </EmailBody>
    </Mjml>
  );
}

interface PostEmailProps {
  post: Post;
  previous: Post;
  next: Post;
  index: number;
  recipient: Subscriber;
}
