import { Mjml, MjmlText } from '@faire/mjml-react';
import { capitalize } from '@mui/material';
import type { Post } from '@prisma/client';

import { SubscriptionType } from 'utils/enum';
import { DOMAINS } from 'utils/functions';
import * as zText from 'utils/lib/text';
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
  const { singular: type, collection: domain } = DOMAINS[post.type];
  const title = `${capitalize(type)} #${index}: ${post.title}`;
  const href = `${Settings.DOMAIN}/${domain}/${post.slug}`;

  const contentType =
    Object.values(SubscriptionType)[
      Object.keys(SubscriptionType).indexOf(type)
    ];
  return (
    <Mjml>
      <EmailHead title={title} preview={zText.extractExcerpt(post.content)} />
      <EmailBody>
        <EmailHeader>
          New {type} on ZAVID.&nbsp;
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
