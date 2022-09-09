import React, { useState } from 'react';
import { Container } from 'react-bootstrap';

import { SubscriberBuilder } from 'classes/subscribers/SubscriberBuilder';
import { Alert, reportError } from 'components/alert';
import { ConfirmButton } from 'components/button';
import { Field, FieldRow, TextInput } from 'components/form';
import { Icon } from 'components/library';
import { Title, VanillaLink } from 'components/text';
import { UIError } from 'constants/errors';
import { ACCOUNTS, COPYRIGHT } from 'constants/settings';
import Utils from 'constants/utils';
import { checkValidEmail } from 'constants/validations';
import css from 'styles/Partials.module.scss';

const footerLinks = [
  { name: 'About Zavid', url: '/about' },
  { name: 'Privacy Policy', url: '/privacy' },
  { name: 'Cookie Policy', url: '/cookies' },
];

export default function Footer() {
  return (
    <footer className={css['footer']}>
      <Container className={css['footer-container']}>
        <FieldRow>
          <Field lg={{ span: 5, order: 2 }} className={css['footer-field']}>
            <SocialPlugs />
          </Field>
          <Field lg={{ span: 4, order: 3 }} className={css['footer-field']}>
            <SubscribeForm />
          </Field>
          <Field lg={{ span: 3, order: 1 }} className={css['footer-field']}>
            <FooterLinks />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field>
            <div className={css['footer-copyright']}>{COPYRIGHT}</div>
          </Field>
        </FieldRow>
      </Container>
    </footer>
  );
}

function FooterLinks() {
  return (
    <React.Fragment>
      <Title className={css['footer-links-title']}>INFORMATION</Title>
      {footerLinks.map(({ name, url }, key) => {
        return (
          <a key={key} href={url} className={css['footer-link']}>
            {name}
          </a>
        );
      })}
    </React.Fragment>
  );
}

function SocialPlugs() {
  return (
    <div>
      <Title className={css['footer-socials-title']}>
        Follow me on socials
      </Title>
      <div>
        <VanillaLink href={ACCOUNTS.twitter} className={css['footer-socials']}>
          <Icon name={'twitter'} prefix={'fab'} withRightSpace={false} />
        </VanillaLink>
        <VanillaLink
          href={ACCOUNTS.instagram}
          className={css['footer-socials']}>
          <Icon name={'instagram'} prefix={'fab'} withRightSpace={false} />
        </VanillaLink>
        <VanillaLink href={ACCOUNTS.linkedin} className={css['footer-socials']}>
          <Icon name={'linkedin'} prefix={'fab'} withRightSpace={false} />
        </VanillaLink>
        <VanillaLink href={ACCOUNTS.snapchat} className={css['footer-socials']}>
          <Icon name={'snapchat-ghost'} prefix={'fab'} withRightSpace={false} />
        </VanillaLink>
      </div>
    </div>
  );
}

function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [isRequestPending, setRequestPending] = useState(false);

  async function subscribeEmail() {
    setRequestPending(true);
    try {
      checkValidEmail(email);

      const payload = new SubscriberBuilder()
        .withEmail(email)
        .withDefaultSubscriptions()
        .build();

      const res = await Utils.request('/api/subscribers', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
      Alert.success(
        `Thank you for subscribing!\nI've added ${email} to my mailing list.`,
      );
    } catch (e: any) {
      if (e instanceof UIError) {
        reportError(e.message, true);
      } else if (e.message.includes('ER_DUP_ENTRY')) {
        Alert.error('The email address you submitted already exists.');
      } else {
        reportError(e.message);
      }
    } finally {
      setRequestPending(false);
    }
  }

  return (
    <div>
      <Title className={css['quick-subscribe-title']}>Quick Subscribe</Title>
      <div className={css['quick-subscribe-message']}>
        And never miss a diary entry nor a post.
      </div>
      <TextInput
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={'Enter your email address'}
        className={css['quick-subscribe-input']}
      />
      <ConfirmButton
        onClick={subscribeEmail}
        isRequestPending={isRequestPending}
        className={css['quick-subscribe-button']}>
        Submit
      </ConfirmButton>
    </div>
  );
}
